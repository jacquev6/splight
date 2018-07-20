'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')

const durations = require('../durations')
const paths = require('../paths')
const template = require('./durationSelector.html')

function make ({preBrowser, citySlug, startDate, duration}) {
  return {
    html: mustache.render(
      template,
      {
        durations: Array.from(durations.all).sort((d1, d2) => d2.days - d1.days).map(d => ({value: d.days, name: d.name}))
      }
    ),
    initialize: function () {
      durations.all.forEach(d => {
        preBrowser.register(paths.timespan(citySlug, startDate, d))
      })
      const dropdown = jQuery('#sp-timespan-duration')
      dropdown.val(duration.days)
      dropdown.on('change', function () {
        // @todo Fix bug: display one day, navigate to last saturday or sunday, switch to three days: nothing happens
        // because this would display a date that's not published
        preBrowser.go({
          url: paths.timespan(citySlug, startDate, durations.byDays[dropdown.val()]),
          overrideQuery: false
        })
      })
    }
  }
}

exports.make = make
