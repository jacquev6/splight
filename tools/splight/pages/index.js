'use strict'

/* global Modernizr */

const assert = require('assert')

const $ = require('jquery')
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

const timespan = (function () {
  const oneWeek = (function () {
    const slugFormat = 'GGGG-[W]WW'

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
    const slugFormat = 'YYYY-MM-DD+2'

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
    const slugFormat = 'YYYY-MM-DD'

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
  const index = {
    path: '/',
    initializeInBrowser: function () {
      return Promise.all([
        randomizeCanvases()
      ])
    },
    make: async function () {
      const cities = await source.getCities()
      cities.forEach(city => {
        city.url = cityIndex(city.slug).path
      })
      return {
        title: 'Splight',
        jumbotron: '<h1 class="display-4"><a href="/">Splight</a></h1><p class="lead">Votre agenda culturel régional</p>',
        content: mustache.render(require('./index.html'), {cities})
      }
    }
  }

  function makeCityTitle (city) {
    return mustache.render('{{name}} - Splight', city)
  }

  function makeCityJumbotron (city) {
    city.url = cityIndex(city.slug).path
    return mustache.render(
      '<h1 class="display-4"><a href="/">Splight</a> - <a href="{{url}}">{{name}}</a></h1>' +
      '<p class="lead">Votre agenda culturel à {{name}} et dans sa région</p>',
      city
    )
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
      make: async function () {
        const city = await source.getCity(citySlug)

        return {
          title: makeCityTitle(city),
          jumbotron: makeCityJumbotron(city),
          content: mustache.render(
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
      make: async function () {
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

        const [events, tags] = await Promise.all([source.getEvents(city.slug, startDate, dateAfter), source.getTags(city.slug)])

        const eventsByDay = {}

        for (var d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
          eventsByDay[d.format('YYYY-MM-DD')] = []
        }

        events.forEach(function ({title, start}) {
          eventsByDay[start.format('YYYY-MM-DD')].push({
            title,
            time: start.format('HH:mm')
          })
        })

        const days = []

        for (d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
          const date = d.format('YYYY-MM-DD')
          days.push({
            date,
            events: eventsByDay[date]
          })
        }

        return {
          title: makeCityTitle(city),
          jumbotron: makeCityJumbotron(city),
          content: mustache.render(
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
