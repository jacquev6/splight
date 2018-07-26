'use strict'

const mustache = require('mustache')

const durations = require('../durations')
const paths = require('../paths')
const template = require('./durationSelector.html')

function make ({citySlug, startDate, duration}) {
  function render () {
    return mustache.render(
      template,
      {
        durations:
          Array.from(durations.all)
            .sort((d1, d2) => d2.days - d1.days)
            .map(d => {
              const href = paths.timespan(citySlug, startDate, d)
              const display = d.name
              const active = d === duration
              return {href, display, active}
            })
      }
    )
  }

  return {render}
}

exports.make = make
