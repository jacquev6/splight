'use strict'

const fs = require('fs-extra')
const path = require('path')

const moment = require('moment')
const mustache = require('mustache')

function makeGenerator ({data, scripts}) {
  scripts = scripts || []
  for (const citySlug in data.cities) {
    const city = data.cities[citySlug]
    city.slug = citySlug

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

    city.firstDate = city.events[0].start
  }

  const source = {
    getCities: function () {
      return Object.values(data.cities).map(({slug, name}) => ({slug, name}))
    },

    getCity: function (citySlug) {
      const {slug, name, firstDate} = data.cities[citySlug]
      return {slug, name, firstDate}
    },

    getTags: function (citySlug) {
      return Object.values(data.cities[citySlug].tags).sort(
        (tag1, tag2) => tag1.displayOrder - tag2.displayOrder
      ).map(
        ({slug, title}) => ({slug, title})
      )
    },

    getEvents: function (citySlug, startDate, dateAfter) {
      return data.cities[citySlug].events.filter(({start}) => start.isBetween(startDate, dateAfter, null, '[)'))
    }
  }

  const pages = require('../../pages')(source)

  async function renderPage (page) {
    const {title, jumbotron, content} = await page.make()
    return mustache.render(require('./container.html'), {title, jumbotron, content, scripts})
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

  function citiesData () {
    const ret = {}
    Object.values(data.cities).forEach(({slug, name, firstDate, tags}) => {
      const tags_ = {}
      Object.values(tags).forEach(({slug, title, displayOrder}) => {
        tags_[slug] = {title, displayOrder}
      })
      ret[slug] = {
        name,
        firstDate: firstDate.format(moment.HTML5_FMT.DATE),
        tags: tags_
      }
    })
    return ret
  }

  function timespanData (citySlug, timespanSlug) {
    const week = moment(timespanSlug, 'GGGG-[W]WW', true)
    return {
      events: data.cities[citySlug].events.filter(({start}) => start.isSame(week, 'isoWeek'))
    }
  }

  return {
    indexPage: indexPage,
    cityPage: cityPage,
    timespanPage: timespanPage,
    citiesData: citiesData,
    timespanData: timespanData
  }
}

exports.generator = makeGenerator

exports.generate = function (data, outputDirectory) {
  const generator = makeGenerator({data})

  async function outputIndex (html, destination) {
    var text = await html
    fs.outputFile(path.join(outputDirectory, destination, 'index.html'), text)
  }

  outputIndex(generator.indexPage(), '')

  for (const citySlug in data.cities) {
    outputIndex(generator.cityPage(citySlug), citySlug)
  }
}
