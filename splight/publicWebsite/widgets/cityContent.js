'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')
const URI = require('urijs')

const datetime = require('../../datetime')
const paths = require('../paths')
const durations = require('../durations')
const template = require('./cityContent.html')

function make ({citySlug}) {
  const nowWeekPath = paths.timespan(citySlug, datetime.visitNow(), durations.oneWeek)

  function render (data) {
    const city = data.city

    return mustache.render(template, {city, nowWeekPath})
  }

  function initialize () {
    jQuery('.sp-now-week-link').attr('href', (index, href) => URI(href).path(nowWeekPath).toString())
  }

  return {render, initialize}
}

Object.assign(exports, {make})
