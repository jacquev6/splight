'use strict'

/* global Modernizr */

const assert = require('assert')

const $ = require('jquery')
const Joi = require('joi') // @todo Don't require in production (in browser)
const moment = require('moment')
const mustache = require('mustache')
const URI = require('urijs')

const randomizeCanvas = require('../../randomizeCanvas')

function randomizeCanvases () {
  if (Modernizr.canvas) {
    $('canvas[data-sp-random-seed]').each(function () {
      const c = $(this)
      randomizeCanvas({
        canvas: this,
        seed: c.data('sp-random-seed'),
        width: c.attr('width'),
        height: c.attr('height')
      })
    })
  }
}

function validateSource (source) {
  assert(source.getCities)
  assert(source.getCity)
  assert(source.getTags)
  assert(source.getEvents)

  function str () {
    return Joi.string().required()
  }

  function obj (schema) {
    return Joi.object(schema).required()
  }

  function arr (schema) {
    return Joi.array().items(schema)
  }

  const cities = arr(obj({
    slug: str(),
    name: str()
  }))

  const city = obj({
    slug: str(),
    name: str(),
    firstDate: Joi.any().required() // Actually, a moment
  })

  const tags = arr(obj({
    slug: str(),
    title: str()
  }))

  const events = arr(obj({
    date: str(),
    events: arr(Joi.object({
      title: str(),
      time: str()
    }))
  }))

  function attempt (value, schema) {
    return Joi.attempt(value, schema, {abortEarly: false, convert: false})
  }

  return {
    getCities: async function () {
      return attempt(await source.getCities(), cities)
    },

    getCity: async function (citySlug) {
      return attempt(await source.getCity(citySlug), city)
    },

    getTags: async function (citySlug) {
      return attempt(await source.getTags(citySlug), tags)
    },

    getEvents: async function (citySlug, startDate, dateAfter) {
      return attempt(await source.getEvents(citySlug, startDate, dateAfter), events)
    }
  }
}

const timespan = (function () {
  const oneWeek = (function () {
    const slugFormat = moment.HTML5_FMT.WEEK

    function slugify (startDate) {
      return startDate.format(slugFormat)
    }

    function make (startDate) {
      return {
        duration: 'Semaine',
        startDate: startDate.clone(),
        dateAfter: startDate.clone().add(7, 'days'),
        previousLinkText: 'Semaine précédente',
        previousLinkSlug: slugify(startDate.clone().subtract(7, 'days')),
        nextLinkText: 'Semaine suivante',
        nextLinkSlug: slugify(startDate.clone().add(7, 'days')),
        now1LinkText: 'Cette semaine',
        now1LinkSlug: now => slugify(now),
        now2LinkText: 'La semaine prochaine',
        now2LinkSlug: now => slugify(now.clone().add(7, 'days'))
      }
    }

    return {slugFormat, slugify, make}
  }())

  const threeDays = (function () {
    const slugFormat = moment.HTML5_FMT.DATE + '+2'

    function slugify (startDate) {
      return startDate.format(slugFormat)
    }

    function make (startDate) {
      return {
        duration: '3 jours à partir',
        startDate: startDate.clone(),
        dateAfter: startDate.clone().add(3, 'days'),
        previousLinkText: 'Jours précédents',
        previousLinkSlug: slugify(startDate.clone().subtract(1, 'days')),
        nextLinkText: 'Jours suivants',
        nextLinkSlug: slugify(startDate.clone().add(1, 'days')),
        now1LinkText: 'Ces 3 jours',
        now1LinkSlug: now => slugify(now),
        now2LinkText: 'Le week-end prochain',
        now2LinkSlug: now => slugify(now.clone().add(3, 'days').startOf('isoWeek').add(4, 'days'))
      }
    }

    return {slugFormat, slugify, make}
  }())

  const oneDay = (function () {
    const slugFormat = moment.HTML5_FMT.DATE

    function slugify (startDate) {
      return startDate.format(slugFormat)
    }

    function make (startDate) {
      return {
        duration: 'Journée',
        startDate: startDate.clone(),
        dateAfter: startDate.clone().add(1, 'days'),
        previousLinkText: 'Journée précédente',
        previousLinkSlug: slugify(startDate.clone().subtract(1, 'days')),
        nextLinkText: 'Journée suivante',
        nextLinkSlug: slugify(startDate.clone().add(1, 'days')),
        now1LinkText: "Aujourd'hui",
        now1LinkSlug: now => slugify(now),
        now2LinkText: 'Demain',
        now2LinkSlug: now => slugify(now.clone().add(1, 'days'))
      }
    }

    return {slugFormat, slugify, make}
  }())

  function make (timespanSlug) {
    return [oneWeek, threeDays, oneDay].reduce(function (r, ts) {
      if (r) {
        return r
      } else {
        const startDate = moment(timespanSlug, ts.slugFormat, true)
        if (startDate.isValid()) {
          return ts.make(startDate)
        } else {
          return null
        }
      }
    }, null)
  }

  return {
    make,
    oneWeek,
    threeDays,
    oneDay
  }
}())

module.exports = function (source) {
  source = validateSource(source)

  const index = {
    path: '/',
    initializeInBrowser: function () {
      return Promise.all([
        randomizeCanvases()
      ])
    },
    makeTitle: async function () {
      return {
        lead: 'Votre agenda culturel régional'
      }
    },
    makeContent: async function () {
      const cities = await source.getCities()
      cities.forEach(city => {
        city.url = cityIndex(city.slug).path
      })
      return mustache.render(require('./index.html'), {cities})
    }
  }

  function makeCityTitle (citySlug) {
    return async function () {
      const city = await source.getCity(citySlug)
      return {
        sub: {href: cityIndex(city.slug).path, text: city.name},
        lead: `Votre agenda culturel à ${city.name} et dans sa région`
      }
    }
  }

  function cityIndex (citySlug) {
    return {
      path: ['', citySlug, ''].join('/'),
      initializeInBrowser: function () {
        return Promise.all([
          randomizeCanvases(),
          $('.sp-now-week-link').attr('href', (index, href) => URI(href).path(['', citySlug, timespan.oneWeek.slugify(moment()), ''].join('/')).toString())
        ])
      },
      makeTitle: makeCityTitle(citySlug),
      makeContent: async function () {
        const city = await source.getCity(citySlug)
        return mustache.render(
          require('./cityIndex.html'),
          {
            city,
            tags: await source.getTags(city.slug),
            firstWeekUrl: ['', citySlug, timespan.oneWeek.slugify(city.firstDate)].join('/')
          }
        )
      }
    }
  }

  function cityTimespan (citySlug, timespanSlug) {
    const ts = timespan.make(timespanSlug)

    return {
      path: ['', citySlug, timespanSlug, ''].join('/'),
      initializeInBrowser: function () {
        return Promise.all([
          randomizeCanvases(),
          $('.sp-timespan-now-1').attr('href', (index, href) => URI(href).path(['', citySlug, ts.now1LinkSlug(moment()), ''].join('/')).toString()),
          $('.sp-timespan-now-2').attr('href', (index, href) => URI(href).path(['', citySlug, ts.now2LinkSlug(moment()), ''].join('/')).toString())
        ])
      },
      makeTitle: makeCityTitle(citySlug),
      makeContent: async function () {
        const city = await source.getCity(citySlug)

        const {
          duration,
          startDate,
          dateAfter,
          previousLinkSlug,
          nextLinkSlug,
          previousLinkText,
          nextLinkText,
          now1LinkText,
          now2LinkText
        } = ts

        const days = await source.getEvents(city.slug, startDate, dateAfter)

        const tags = await source.getTags(city.slug)

        return mustache.render(
          require('./cityTimespan.html'),
          {
            city,
            duration,
            startDate: startDate.format(),
            days,
            tags,
            previousLinkSlug,
            nextLinkSlug,
            previousLinkText,
            nextLinkText,
            now1LinkText,
            now2LinkText
          }
        )
      }
    }
  }

  function fromUrl (url) {
    const parts = URI.parse(url).path.split('/')
    assert(parts[0] === '', 'Unexpected path: ' + url)
    assert(parts.slice(-1)[0] === '', 'Unexpected path: ' + url)
    switch (parts.length) {
      case 2:
        return index
      case 3:
        return cityIndex(parts[1])
      case 4:
        return cityTimespan(parts[1], parts[2])
      default:
        assert.fail('Unexpected path: ' + url)
    }
  }

  const pages = {}

  pages.index = index
  pages.cityIndex = cityIndex
  pages.cityTimespan = cityTimespan
  pages.fromUrl = fromUrl

  return pages
}
