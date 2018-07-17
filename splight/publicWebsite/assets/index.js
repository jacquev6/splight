'use strict'

/* global setTimeout */

const assert = require('assert')
const bootstrap = require('bootstrap') // eslint-disable-line
const jquery = require('jquery')
const moment = require('moment')
const path = require('path')

// @todo Remove when https://github.com/moment/moment/issues/4698 is fixed on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'
assert.equal(moment.HTML5_FMT.WEEK, 'GGGG-[W]WW')

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
      return get(path.join(citySlug, week.format(moment.HTML5_FMT.WEEK)))
    }
  }
}())

const pages = require('../pages')(fetcher)

jquery(async function () {
  const page = pages.fromUrl(window.location.href)
  await page.initializeInBrowser(true)
})
