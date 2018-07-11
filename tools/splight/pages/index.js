'use strict'

/* global Modernizr */

const assert = require('assert')

const $ = require('jquery')
const moment = require('moment')
const URI = require('urijs')

const randomizeCanvas = require('../../randomizeCanvas')
const splightUrls = require('./urls')
const timespan = require('./timespan')

function randomizeCanvases () {
  if (Modernizr.canvas) {
    $('canvas[data-sp-random-seed]').each(function () {
      const c = $(this)
      randomizeCanvas({
        canvas: this,
        seed: c.data('sp-random-seed'),
        width: c.attr('width'),
        height: c.attr('height')
      })
    })
  }
}

const index = {
  path: '/',
  contentTemplate: require('./index.html'),
  initializeInBrowser: function () {
    return Promise.all([
      randomizeCanvases()
    ])
  }
}

function cityIndex (citySlug) {
  return {
    path: ['', citySlug, ''].join('/'),
    contentTemplate: require('./cityIndex.html'),
    initializeInBrowser: function () {
      return Promise.all([
        randomizeCanvases(),
        $('.sp-now-week-link').prop('href', (index, href) => splightUrls.makeWeek({url: href, week: moment()}))
      ])
    }
  }
}

function cityTimespan (citySlug, timespanSlug) {
  return {
    path: ['', citySlug, timespanSlug, ''].join('/'),
    contentTemplate: require('./cityTimespan.html'),
    timespan: timespan.make(timespanSlug),
    initializeInBrowser: function () {
      return Promise.all([
        randomizeCanvases(),
        $('.sp-timespan-now-1').prop('href', (index, href) => splightUrls.makeTimespan({url: href, timespanSlug: this.timespan.now1LinkSlug(moment())})),
        $('.sp-timespan-now-2').prop('href', (index, href) => splightUrls.makeTimespan({url: href, timespanSlug: this.timespan.now2LinkSlug(moment())}))
      ])
    }
  }
}

function fromUrl (url) {
  const parts = URI.parse(url).path.split('/')
  assert(parts[0] === '', 'Unexpected path: ' + url)
  assert(parts.slice(-1)[0] === '', 'Unexpected path: ' + url)
  switch (parts.length) {
    case 2:
      return index
    case 3:
      return cityIndex(parts[1])
    case 4:
      return cityTimespan(parts[1], parts[2])
    default:
      assert.fail('Unexpected path: ' + url)
  }
}

exports.index = index
exports.cityIndex = cityIndex
exports.cityTimespan = cityTimespan
exports.fromUrl = fromUrl