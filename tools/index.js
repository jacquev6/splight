'use strict'
/* global Modernizr */
const $ = global.jQuery = require('jquery')
require('bootstrap')
const moment = require('moment')

const randomizeCanvas = require('./randomize_canvas')
const splightUrls = require('./splight-urls')

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
})
