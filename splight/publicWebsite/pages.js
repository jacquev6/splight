'use strict'

const assert = require('assert').strict
const moment = require('moment')
const URI = require('urijs')

const cityContent = require('./widgets/cityContent')
const cityTitle = require('./widgets/cityTitle')
const durations = require('./durations')
const paths = require('./paths')
const preBrowser_ = require('./preBrowser')
const rootContent = require('./widgets/rootContent')
const rootTitle = require('./widgets/rootTitle')
const source_ = require('./source')
const timespanContent = require('./widgets/timespanContent')

function make ({fetcher, now}) {
  const source = source_.make({fetcher, now})

  const preBrowser = preBrowser_.make(fromPath)

  function root () {
    const title = rootTitle.make()
    const content = rootContent.make({source})

    return {
      path: paths.root(),
      title,
      content,
      initialize: function () {
        title.initialize()
        content.initialize()
        preBrowser.initialize()
      },
      images: async function () {
        return (await source.getCities()).map(city => '/' + city.slug + '.png')
      }
    }
  }

  function city (citySlug) {
    const title = cityTitle.make({source, citySlug})
    const content = cityContent.make({source, citySlug})

    return {
      path: paths.city(citySlug),
      title,
      content,
      initialize: function () {
        title.initialize()
        content.initialize()
        preBrowser.initialize()
      },
      images: async function () {
        const city = await source.getCity(citySlug)
        return ['/all-tags.png'].concat(city.tags.map(tag => '/' + city.slug + '/' + tag.slug + '.png'))
      }
    }
  }

  function timespan (citySlug, startDate, duration) {
    const title = cityTitle.make({source, citySlug})
    const content = timespanContent.make({source, preBrowser, citySlug, startDate, duration})

    return {
      path: paths.timespan(citySlug, startDate, duration),
      title,
      content,
      initialize: function () {
        title.initialize()
        content.initialize()
        preBrowser.initialize()
      },
      images: async function () {
        return []
      }
    }
  }

  timespan.ofSlugs = function (citySlug, timespanSlug) {
    for (var duration of durations.all) {
      const startDate = moment(timespanSlug, duration.slugFormat, true)
      if (startDate.isValid()) {
        return timespan(citySlug, startDate, duration)
      }
    }
  }

  function fromPath (url) {
    const parts = URI.parse(url).path.split('/')
    assert(parts[0] === '', 'Unexpected path: ' + url)
    assert(parts.slice(-1)[0] === '', 'Unexpected path: ' + url)
    switch (parts.length) {
      case 2:
        return root()
      case 3:
        return city(parts[1])
      case 4:
        return timespan.ofSlugs(parts[1], parts[2])
      default:
        assert.fail('Unexpected path: ' + url)
    }
  }

  return {root, city, timespan, fromPath}
}

exports.make = make
