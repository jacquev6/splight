'use strict'

const fs = require('fs-extra')
const path = require('path')

const moment = require('moment')
const mustache = require('mustache')

const splightUrls = require('../../urls')
const templates = require('./templates')

function makeHtml (contentTemplate, contentData, subtitle, lead) {
  return mustache.render(
    templates.container,
    {
      static_content: mustache.render(contentTemplate, contentData),
      subtitle: subtitle,
      lead: lead
    }
  )
}

function makeGenerator (data) {
  function indexPage () {
    const cities = []
    for (const citySlug in data.cities) {
      const city = Object.assign({}, data.cities[citySlug], {slug: citySlug, url: splightUrls.makeCity({city: citySlug})})
      cities.push(city)
    }
    return makeHtml(templates.staticContent.index, {cities: cities}, null, 'Votre agenda culturel régional', '')
  }

  function cityPage (citySlug) {
    const city = Object.assign({}, data.cities[citySlug], {slug: citySlug})

    const tags = (function () {
      var tags = []
      for (const tagSlug in city.tags) {
        const tag = Object.assign({}, city.tags[tagSlug], {slug: tagSlug})
        tags.push(tag)
      }
      return tags.sort(
        (tag1, tag2) => tag1.display_order - tag2.display_order
      ).map(
        ({slug, title}) => ({slug: slug, title: title})
      )
    })()

    const events = (function () {
      const events = []
      for (const mainTag in city.events) {
        city.events[mainTag].forEach(function (event) {
          events.push({
            start: moment(event.datetime, 'YYYY/MM/DD HH:mm', true)
          })
        })
      }
      return events.sort(
        (e1, e2) => e1.start.diff(e2.start)
      )
    })()

    return makeHtml(
      templates.staticContent.city.index,
      {
        city: city,
        tags: tags,
        first_week_url: splightUrls.makeWeek({city: city.slug, week: events[0].start})
      },
      {
        href: splightUrls.makeCity({city: city.slug}),
        text: city.name
      },
      'Votre agenda culturel à ' + city.name + ' et dans sa région'
    )
  }

  return {
    indexPage: indexPage,
    cityPage: cityPage
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
