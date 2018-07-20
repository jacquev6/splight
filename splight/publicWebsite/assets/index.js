'use strict'

/* global Modernizr */

const assert = require('assert').strict
assert(false) // This is removed by the unassertify plugin of browserify

var hasModernJavascript = true

for (var k in Modernizr) {
  if (Modernizr.hasOwnProperty(k)) {
    if (!Modernizr[k]) {
      hasModernJavascript = false
    }
  }
}

if (hasModernJavascript) {
  const bootstrap = require('bootstrap') // eslint-disable-line
  const jquery = require('jquery')
  const moment = require('moment')
  const moment_fr = require('moment/locale/fr') // eslint-disable-line
  const URI = require('urijs')

  // @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
  moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

  const durations = require('../durations')
  const pages = require('../pages')

  const fetcher = (function () {
    const data = {}

    function get (key) {
      if (!data[key]) {
        data[key] = jquery.getJSON('/' + key + '.json')
      }
      return data[key]
    }

    return {
      cities: get('cities'),

      getCityWeek: function (citySlug, week) {
        return get(citySlug + '/' + week.format(durations.oneWeek.slugFormat))
      }
    }
  }())

  jquery(function () {
    pages.make({fetcher, now: moment()}).fromPath(URI.parse(window.location.href).path).initialize()
  })
}
