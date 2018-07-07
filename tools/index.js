/* global Modernizr */
const $ = global.jQuery = require('jquery')
require('bootstrap')

const randomizeCanvas = require('./randomize_canvas.bc').randomize_canvas

$(function () {
  $('.sp-modern').removeClass('sp-loading')

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
