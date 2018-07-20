'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')
const URI = require('urijs')

const paths = require('../paths')
const durations = require('../durations')
const template = require('./cityContent.html')

function make ({source, citySlug}) {
  const city = source.getCity(citySlug)

  const nowWeekPath = paths.timespan(citySlug, source.getNow(), durations.oneWeek)

  return {
    html: (async () =>
      mustache.render(
        template,
        {
          city: (await city),
          nowWeekPath
        }
      )
    )(),
    initialize: function () {
      jQuery('.sp-now-week-link').attr('href', (index, href) => URI(href).path(nowWeekPath).toString())
    }
  }
}

exports.make = make
