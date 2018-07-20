'use strict'

/* global setTimeout, Modernizr */

const assert = require('assert')
assert(false) // This is removed by the unassertify plugin of browserify

const bootstrap = require('bootstrap') // eslint-disable-line
const jquery = require('jquery')
const moment = require('moment')
const URI = require('urijs')

const pages = require('../pages')

// @todo Remove when https://github.com/moment/moment/issues/4698 is fixed on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'
assert.equal(moment.HTML5_FMT.WEEK, 'GGGG-[W]WW')

var hasModernJavascript = true

for (var k in Modernizr) {
  if (Modernizr.hasOwnProperty(k)) {
    if (!Modernizr[k]) {
      hasModernJavascript = false
    }
  }
}

if (hasModernJavascript) {
  const fetcher = (function () {
    const data = {}

    function get (key) {
      if (!data[key]) {
        data[key] = jquery.getJSON('/' + key + '.json')
      }
      return data[key]
    }

    return {
      getCities: function () {
        return get('cities')
      },

      getCityWeek: function (citySlug, week) {
        return get(citySlug + '/' + week.format(moment.HTML5_FMT.WEEK))
      }
    }
  }())

  jquery(function () {
    pages.make(moment(), fetcher).fromPath(URI.parse(window.location.href).path).initializeInBrowser()
  })
}
