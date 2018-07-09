'use strict'

const fs = require('fs-extra')
const path = require('path')

const moment = require('moment')
const mustache = require('mustache')

const splightUrls = require('../../urls')
const templates = require('./templates')

exports.generate = function (data, outputDirectory) {
  function renderHtml (contentTemplate, contentData, subtitle, lead, destination) {
    const staticContent = mustache.render(contentTemplate, contentData)
    fs.outputFileSync(
      path.join(outputDirectory, destination, 'index.html'),
      mustache.render(
        templates.container,
        {static_content: staticContent, subtitle: subtitle, lead: lead}
      )
    )
  }

  (function () {
    const cities = []
    for (const citySlug in data.cities) {
      const city = Object.assign({}, data.cities[citySlug], {slug: citySlug, url: splightUrls.makeCity({city: citySlug})})
      cities.push(city)
    }
    renderHtml(templates.staticContent.index, {cities: cities}, null, 'Votre agenda culturel régional', '')
  })()

  for (const citySlug in data.cities) {
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

    renderHtml(
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
      'Votre agenda culturel à ' + city.name + ' et dans sa région',
      citySlug
    )
  }
}
