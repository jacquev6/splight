'use strict'

/* global history */

const assert = require('assert')
const jQuery = require('jquery')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line
const mustache = require('mustache')
const URI = require('urijs')

// @todo Remove when https://github.com/moment/moment/issues/4698 is fixed on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'
assert.equal(moment.HTML5_FMT.WEEK, 'GGGG-[W]WW')

const randomizeCanvas = require('../../randomizeCanvas')

moment.locale('fr')

function randomizeCanvases () {
  jQuery('canvas[data-sp-random-seed]').each(function () {
    const c = jQuery(this)
    randomizeCanvas({
      canvas: this,
      seed: c.data('sp-random-seed'),
      width: c.attr('width'),
      height: c.attr('height')
    })
  })
}

const durations = (function () {
  const oneDay = (function () {
    function clip (d) {
      return d.clone().startOf('day')
    }

    return {
      days: 1,
      clip,
      titleFormat: '[Journée du] dddd LL',
      slugFormat: moment.HTML5_FMT.DATE,
      dateAfter: startDate => clip(startDate).add(1, 'day'),
      links: {
        previous: {text: 'Journée précédente', startDate: startDate => clip(startDate).subtract(1, 'day')},
        next: {text: 'Journée suivante', startDate: startDate => clip(startDate).add(1, 'day')},
        now1: {text: "Aujourd'hui", startDate: now => clip(now)},
        now2: {text: 'Demain', startDate: now => clip(now).add(1, 'day')}
      }
    }
  }())

  const threeDays = (function () {
    function clip (d) {
      return d.clone().startOf('day')
    }

    return {
      days: 3,
      clip,
      titleFormat: '[3 jours à partir du] dddd LL',
      slugFormat: moment.HTML5_FMT.DATE + '+2',
      dateAfter: startDate => clip(startDate).add(3, 'days'),
      links: {
        previous: {text: 'Jours précédents', startDate: startDate => clip(startDate).add(1, 'day')},
        next: {text: 'Jours suivants', startDate: startDate => clip(startDate).add(1, 'day')},
        now1: {text: 'Ces 3 jours', startDate: now => clip(now)},
        now2: {text: 'Le week-end prochain', startDate: now => clip(now).add(3, 'days').startOf('isoWeek').add(4, 'days')}
      }
    }
  }())

  const oneWeek = (function () {
    function clip (d) {
      return d.clone().startOf('isoWeek')
    }

    return {
      days: 7,
      clip,
      slugFormat: moment.HTML5_FMT.WEEK,
      titleFormat: '[Semaine du] dddd LL',
      dateAfter: startDate => clip(startDate).add(7, 'days'),
      links: {
        previous: {text: 'Semaine précédente', startDate: startDate => clip(startDate).subtract(7, 'days')},
        next: {text: 'Semaine suivante', startDate: startDate => clip(startDate).add(7, 'days')},
        now1: {text: 'Cette semaine', startDate: now => clip(now)},
        now2: {text: 'La semaine prochaine', startDate: now => clip(now).add(7, 'days')}
      }
    }
  }())

  return {oneDay, threeDays, oneWeek}
}())

function make (now, fetcher) {
  const source = (function () {
    const cities = fetcher.getCities().then(cities => {
      cities.forEach(city => {
        city.url = cityIndex(city.slug).path
      })
      return cities
    })

    function getCities () {
      return cities
    }

    const citiesBySlug = cities.then(cities => {
      const citiesBySlug = {}
      cities.forEach(city => {
        citiesBySlug[city.slug] = city
      })
      return citiesBySlug
    })

    async function getCity (citySlug) {
      return (await citiesBySlug)[citySlug]
    }

    const cityWeeks = {}

    function getCityWeek (citySlug, week) {
      const key = citySlug + '/' + week.format(moment.HTML5_FMT.WEEK)
      if (!cityWeeks[key]) {
        cityWeeks[key] = fetcher.getCityWeek(citySlug, week).then(cityWeek => {
          cityWeek.events.forEach(event => {
            event.start = moment(event.start, moment.HTML5_FMT.DATETIME_LOCAL, true)
          })
          return cityWeek
        })
      }
      return cityWeeks[key]
    }

    async function getEvents (citySlug, startDate, dateAfter) {
      const weeksToFetch = []
      for (var week = startDate.clone().startOf('isoWeek'); week.isBefore(dateAfter); week.add(7, 'days')) {
        weeksToFetch.push(getCityWeek(citySlug, week).then(({events}) => events))
      }
      const weeks = await Promise.all(weeksToFetch)
      return weeks.reduce((a, b) => a.concat(b)).filter(({start}) => start.isBetween(startDate, dateAfter, null, '[)'))
    }

    return {getCities, getCity, getEvents}
  }())

  const anticipatedNavigations = {}

  function anticipateNavigationTo (url) {
    url = URI.parse(url)
    const path = url.path
    const query = url.query
    if (!anticipatedNavigations[path]) {
      const page = fromPath(path)
      anticipatedNavigations[path] = page.make().then(({title, jumbotron, content}) => ({title, jumbotron, content, page}))
    }
    return anticipatedNavigations[path].then(({title, jumbotron, content, page}) => ({title, jumbotron, content, page, path, query}))
  }

  function navigateTo (url) {
    anticipateNavigationTo(url).then(({title, jumbotron, content, page, path, query}) => {
      history.replaceState(null, title, URI(window.location.href).path(path).query(query || '').toString())
      jQuery('title').text(title)
      jQuery('#sp-jumbotron').html(jumbotron)
      jQuery('#sp-content').html(content)
      page.initializeInBrowser()
    })
  }

  function hookInternalLinks () {
    const links = jQuery("a[href^='/']")
    links.off('click')
    links.on('click', function (event) {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return true
      } else {
        navigateTo(jQuery(this).attr('href'))
        return false
      }
    })
    links.each(function () {
      anticipateNavigationTo(jQuery(this).attr('href'))
    })
  }

  const index = {
    path: '/',
    initializeInBrowser: function () {
      randomizeCanvases()
      hookInternalLinks()
    },
    make: async function () {
      const cities = await source.getCities()
      return {
        title: 'Splight',
        jumbotron: '<h1 class="display-4"><a href="/">Splight</a></h1><p class="lead">Votre agenda culturel régional</p>',
        content: mustache.render(require('./pages/index.html'), {cities})
      }
    }
  }

  function makeCityTitle (city) {
    return mustache.render('{{name}} - Splight', city)
  }

  function makeCityJumbotron (city) {
    city.url = cityIndex(city.slug).path
    return mustache.render(
      '<h1 class="display-4"><a href="/">Splight</a> - <a href="{{{url}}}">{{name}}</a></h1>' +
      '<p class="lead">Votre agenda culturel à {{name}} et dans sa région</p>',
      city
    )
  }

  function cityIndex (citySlug) {
    return {
      path: ['', citySlug, ''].join('/'),
      initializeInBrowser: function () {
        randomizeCanvases()
        hookInternalLinks()
        jQuery('.sp-now-week-link').attr('href', (index, href) => URI(href).path(cityTimespan(citySlug, now, durations.oneWeek).path).toString())
      },
      make: async function () {
        const city = await source.getCity(citySlug)

        return {
          title: makeCityTitle(city),
          jumbotron: makeCityJumbotron(city),
          content: mustache.render(
            require('./pages/cityIndex.html'),
            {
              city,
              tags: city.tags,
              nowWeekUrl: cityTimespan(citySlug, now, durations.oneWeek).path
            }
          )
        }
      }
    }
  }

  function cityTimespan (citySlug, startDate, duration) {
    startDate = duration.clip(startDate)
    const dateAfter = duration.dateAfter(startDate)

    function makePath (d) {
      return ['', citySlug, d.format(duration.slugFormat), ''].join('/')
    }

    const links = {
      previous: {text: duration.links.previous.text, path: makePath(duration.links.previous.startDate(startDate))},
      next: {text: duration.links.next.text, path: makePath(duration.links.next.startDate(startDate))},
      now1: {text: duration.links.now1.text, path: makePath(duration.links.now1.startDate(now))},
      now2: {text: duration.links.now2.text, path: makePath(duration.links.now2.startDate(now))}
    }

    return {
      path: makePath(startDate),
      initializeInBrowser: function () {
        randomizeCanvases()

        jQuery('.sp-timespan-now-1').attr('href', (index, href) => URI(href).path(links.now1.path).toString())
        jQuery('.sp-timespan-now-2').attr('href', (index, href) => URI(href).path(links.now2.path).toString())

        hookInternalLinks()

        ;(function () {
          const durationsByDays = {}
          Object.values(durations).forEach(duration => {
            durationsByDays[duration.days] = duration
            anticipateNavigationTo(cityTimespan(citySlug, startDate, duration).path)
          })
          const dropdown = jQuery('#sp-timespan-duration')
          dropdown.val(duration.days)
          dropdown.on('change', function () {
            const duration = durationsByDays[dropdown.val()]
            navigateTo(cityTimespan(citySlug, startDate, duration).path)
          })
        }())

        const allTags = new Set(jQuery('#sp-tag-filtering input').map((index, input) => jQuery(input).val()).toArray())
        const query = URI.parseQuery(URI.parse(window.location.href).query)
        if (Object.keys(query).length === 0) {
          jQuery('#sp-tag-filtering input').prop('checked', true)
        } else {
          const displayedTags = new Set(Object.keys(query))
          jQuery('#sp-tag-filtering input').each(function (index, input) {
            input = jQuery(input)
            input.prop('checked', displayedTags.has(input.val()))
          })
        }

        function filterEvents () {
          jQuery('.sp-event').hide()
          const displayedTags = new Set()
          jQuery('#sp-tag-filtering input').each(function (index, input) {
            input = jQuery(input)
            const tag = input.val()
            if (input.prop('checked')) {
              displayedTags.add(tag)
              jQuery('.sp-tag-' + citySlug + '-' + tag).show()
            }
          })

          const newQuery = displayedTags.size === allTags.size ? '' : Array.from(displayedTags).sort().join('&')
          jQuery('.sp-tag-filtering-tagged-link').attr('href', function (index, href) {
            return URI(href).query(newQuery).toString()
          })
          history.replaceState(null, window.document.title, URI(window.location.href).query(newQuery).toString())
        }

        filterEvents()
        jQuery('#sp-tag-filtering input').on('change', filterEvents)
      },
      make: async function () {
        const city = await source.getCity(citySlug)

        const events = await source.getEvents(city.slug, startDate, dateAfter)

        const eventsByDay = {}

        for (var d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
          eventsByDay[d.format(moment.HTML5_FMT.DATE)] = []
        }

        events.forEach(function ({title, start, tags}) {
          eventsByDay[start.format(moment.HTML5_FMT.DATE)].push({
            title,
            time: start.format('LT'),
            mainTag: tags[0],
            tags
          })
        })

        const days = []

        for (d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
          days.push({
            date: d.format('ddd Do MMM'),
            events: eventsByDay[d.format(moment.HTML5_FMT.DATE)]
          })
        }

        try {
          await source.getEvents(citySlug, startDate.clone().subtract(1, 'day'), startDate)
          links.previous.exists = true
        } catch (e) {
          links.previous.exists = false
        }
        try {
          await source.getEvents(citySlug, dateAfter, dateAfter.clone().add(1, 'day'))
          links.next.exists = true
        } catch (e) {
          links.next.exists = false
        }

        return {
          title: makeCityTitle(city),
          jumbotron: makeCityJumbotron(city),
          content: mustache.render(
            require('./pages/cityTimespan.html'),
            {
              city,
              title: startDate.format(duration.titleFormat),
              days,
              links
            }
          )
        }
      }
    }
  }

  cityTimespan.ofSlugs = function (citySlug, timespanSlug) {
    for (var duration of Object.values(durations)) {
      const startDate = moment(timespanSlug, duration.slugFormat, true)
      if (startDate.isValid()) {
        return cityTimespan(citySlug, startDate, duration)
      }
    }
  }

  function fromPath (url) {
    const parts = URI.parse(url).path.split('/')
    assert(parts[0] === '', 'Unexpected path: ' + url)
    assert(parts.slice(-1)[0] === '', 'Unexpected path: ' + url)
    switch (parts.length) {
      case 2:
        return index
      case 3:
        return cityIndex(parts[1])
      case 4:
        return cityTimespan.ofSlugs(parts[1], parts[2])
      default:
        assert.fail('Unexpected path: ' + url)
    }
  }

  return {index, cityIndex, cityTimespan, fromPath}
}

exports.durations = durations
exports.make = make
