'use strict'

const fs = require('fs-extra')
const path = require('path')

const moment = require('moment')
const mustache = require('mustache')

const splightUrls = require('../../pages/urls')

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

  const source = {
    getCities: function () {
      return Object.values(data.cities).map(({name, url}) => ({name, url}))
    },

    getCity: function (citySlug) {
      const {slug, name, title, firstWeekUrl} = data.cities[citySlug]
      return {slug, name, title, firstWeekUrl}
    },

    getTags: function (citySlug) {
      return Object.values(data.cities[citySlug].tags).sort(
        (tag1, tag2) => tag1.display_order - tag2.display_order
      ).map(
        ({slug, title}) => ({slug, title})
      )
    },

    getEvents: function (citySlug, startDate, dateAfter) {
      const eventsByDay = {}

      for (var d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
        eventsByDay[d.format('YYYY-MM-DD')] = []
      }

      data.cities[citySlug].events.forEach(function ({title, start}) {
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

      return days
    }
  }

  const pages = require('../../pages')(source)

  async function renderPage (page) {
    const [title, content] = await Promise.all([page.makeTitle(), page.makeContent()])
    return mustache.render(require('./container.html'), {content, title, reload})
  }

  function indexPage () {
    return renderPage(pages.index)
  }

  function cityPage (citySlug) {
    return renderPage(pages.cityIndex(citySlug))
  }

  function timespanPage (citySlug, timespanSlug) {
    return renderPage(pages.cityTimespan(citySlug, timespanSlug))
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

  async function outputIndex (html, destination) {
    var text = await html
    fs.outputFile(path.join(outputDirectory, destination, 'index.html'), text)
  }

  outputIndex(generator.indexPage(), '')

  for (const citySlug in data.cities) {
    outputIndex(generator.cityPage(citySlug), citySlug)
  }
}
