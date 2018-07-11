'use strict'

/* global Modernizr */

const assert = require('assert')

const $ = require('jquery')
const Joi = require('joi') // @todo Don't require in production (in browser)
const moment = require('moment')
const mustache = require('mustache')
const URI = require('urijs')

const randomizeCanvas = require('../../randomizeCanvas')
const splightUrls = require('./urls')
const timespan = require('./timespan')

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
    name: str(),
    url: str()
  }))

  const city = obj({
    slug: str(),
    name: str(),
    title: obj({
      sub: obj({
        href: str(),
        text: str()
      }),
      lead: str()
    }),
    firstWeekUrl: str()
  })

  const tags = arr(obj({
    slug: str(),
    title: str()
  }))

  const events = arr(obj({
    date: str(),
    events: arr(obj({
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
      return mustache.render(
        require('./index.html'),
        {
          cities: await source.getCities()
        }
      )
    }
  }

  function cityIndex (citySlug) {
    return {
      path: ['', citySlug, ''].join('/'),
      initializeInBrowser: function () {
        return Promise.all([
          randomizeCanvases(),
          $('.sp-now-week-link').attr('href', (index, href) => splightUrls.makeWeek({url: href, week: moment()}))
        ])
      },
      makeTitle: async function () {
        return (await source.getCity(citySlug)).title
      },
      makeContent: async function () {
        const city = await source.getCity(citySlug)
        return mustache.render(
          require('./cityIndex.html'),
          {
            city,
            tags: await source.getTags(citySlug),
            firstWeekUrl: city.firstWeekUrl
          }
        )
      }
    }
  }

  function cityTimespan (citySlug, timespanSlug) {
    return {
      path: ['', citySlug, timespanSlug, ''].join('/'),
      timespan: timespan.make(timespanSlug),
      initializeInBrowser: function () {
        return Promise.all([
          randomizeCanvases(),
          $('.sp-timespan-now-1').attr('href', (index, href) => splightUrls.makeTimespan({url: href, timespanSlug: this.timespan.now1LinkSlug(moment())})),
          $('.sp-timespan-now-2').attr('href', (index, href) => splightUrls.makeTimespan({url: href, timespanSlug: this.timespan.now2LinkSlug(moment())}))
        ])
      },
      makeTitle: async function () {
        return (await source.getCity(citySlug)).title
      },
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
        } = this.timespan

        const days = await source.getEvents(citySlug, startDate, dateAfter)

        const tags = await source.getTags(citySlug)

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
