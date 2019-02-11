'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')
const URI = require('urijs')

const datetime = require('../../datetime')
const paths = require('../paths')
const durations = require('../durations')
const template = require('./cityContent.html')

function make ({citySlug}) {
  function render (data) {
    const city = data.city
    const nowWeekPath = paths.timespan(citySlug, datetime.date(data.generation.date), durations.oneWeek)

    return mustache.render(template, {city, nowWeekPath})
  }

  function initialize () {
    // This generates a dead link if site is visited more than five weeks after it's been generated.
    // But that would mean the site is abandonned and then who cares?
    const nowWeekPath = paths.timespan(citySlug, datetime.now(), durations.oneWeek)
    jQuery('.sp-now-week-link').attr('href', (index, href) => URI(href).path(nowWeekPath).toString())
  }

  return {render, initialize}
}

Object.assign(exports, {make})
