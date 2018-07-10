'use strict'

/* global Modernizr */

const $ = global.jQuery = require('jquery')
require('bootstrap')
const moment = require('moment')
const URI = require('urijs')

const randomizeCanvas = require('../../randomize-canvas')
const splightUrls = require('../urls')
const timespan = require('../timespan')

$(function () {
  $('.sp-modern').removeClass('sp-loading')

  $('.sp-now-week-link').prop('href', function (index, href) {
    return splightUrls.makeWeek({url: href, week: moment()})
  })

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

  const timespanSlug = URI.parse(window.location.href).path.split("/")[2]
  if (timespanSlug) {
    const ts = timespan.make(timespanSlug)
    $('.sp-timespan-now-1').prop('href', function (index, href) {
      return splightUrls.makeTimespan({url: href, timespanSlug: ts.now1LinkSlug(moment())})
    })
    $('.sp-timespan-now-2').prop('href', function (index, href) {
      return splightUrls.makeTimespan({url: href, timespanSlug: ts.now2LinkSlug(moment())})
    })
  }
})
