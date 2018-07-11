'use strict'

const fs = require('fs-extra')
const path = require('path')

const moment = require('moment')
const mustache = require('mustache')

const splightUrls = require('../../pages/urls')
const pages = require('../../pages')

function makeGenerator (data, reload = false) {
  for (const citySlug in data.cities) {
    const city = data.cities[citySlug]
    city.slug = citySlug
    city.url = splightUrls.makeCity({city: citySlug})
    city.title = {
      sub: {href: city.url, text: city.name},
      lead: `Votre agenda culturel à ${city.name} et dans sa région`
    }

    for (const tagSlug in city.tags) {
      const tag = city.tags[tagSlug]
      tag.slug = tagSlug
    }

    const events = []
    for (const mainTag in city.events) {
      city.events[mainTag].forEach(function ({title, occurences, datetime}) {
        if (!occurences) occurences = [{datetime}]
        occurences.forEach(function ({datetime}) {
          events.push({
            title,
            start: moment(datetime, 'YYYY/MM/DD HH:mm', true),
            tags: [mainTag]
          })
        })
      })
    }
    city.events = events.sort(
      (e1, e2) => e1.start.diff(e2.start)
    )

    city.firstWeekUrl = splightUrls.makeWeek({city: city.slug, week: city.events[0].start})
  }

  function makeHtml (contentTemplate, contentData, title) {
    return mustache.render(
      require('./container.html'),
      {
        staticContent: mustache.render(contentTemplate, contentData),
        title: title,
        reload: reload
      }
    )
  }

  function indexPage () {
    const page = pages.index

    return makeHtml(
      page.contentTemplate,
      {
        cities: Object.values(data.cities).map(({name, url}) => ({name, url}))
      },
      {
        lead: 'Votre agenda culturel régional'
      }
    )
  }

  function cityPage (citySlug) {
    const city = data.cities[citySlug]

    const tags = Object.values(city.tags).sort(
      (tag1, tag2) => tag1.display_order - tag2.display_order
    ).map(
      ({slug, title}) => ({slug, title})
    )

    const page = pages.cityIndex(citySlug)

    return makeHtml(
      page.contentTemplate,
      {
        city: city,
        tags: tags,
        firstWeekUrl: city.firstWeekUrl
      },
      city.title
    )
  }

  function timespanPage (citySlug, timespanSlug) {
    const city = data.cities[citySlug]

    const page = pages.cityTimespan(citySlug, timespanSlug)

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
    } = page.timespan

    const eventsByDay = {}
    for (var d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
      eventsByDay[d.format('YYYY-MM-DD')] = []
    }
    city.events.forEach(function ({title, start}) {
      const dayEvents = eventsByDay[start.format('YYYY-MM-DD')]
      if (dayEvents !== undefined) {
        dayEvents.push({
          title,
          time: start.format('HH:mm')
        })
      }
    })
    const days = []
    for (d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
      const date = d.format('YYYY-MM-DD')
      days.push({
        date,
        events: eventsByDay[date]
      })
    }

    const tags = Object.values(city.tags).sort((t1, t2) => t1.display_order - t2.display_order).map(({slug, title}) => ({slug, title}))

    return makeHtml(
      page.contentTemplate,
      {
        city,
        duration,
        startDate: startDate.format() /* + ' au ' + dateAfter.format() */,
        days,
        tags,
        previousLinkSlug: previousLinkSlug,
        nextLinkSlug: nextLinkSlug,
        previousLinkText: previousLinkText,
        nextLinkText: nextLinkText,
        now1LinkText: now1LinkText,
        now2LinkText: now2LinkText
      },
      city.title
    )
  }

  return {
    indexPage: indexPage,
    cityPage: cityPage,
    timespanPage: timespanPage
  }
}

exports.generator = makeGenerator

exports.generate = function (data, outputDirectory) {
  const generator = makeGenerator(data)

  function outputIndex (html, destination) {
    fs.outputFileSync(path.join(outputDirectory, destination, 'index.html'), html)
  }

  outputIndex(generator.indexPage(), '')

  for (const citySlug in data.cities) {
    outputIndex(generator.cityPage(citySlug), citySlug)
  }
}
