'use strict'

const moment = require('moment')
const mustache = require('mustache')

const template = '<ul>{{#occurrences}}<li>Le {{date}} à {{time}}</li>{{/occurrences}}</ul>'

function render ({event: {occurrences}}) {
  occurrences = occurrences.map(({start}) => {
    start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)

    return {
      date: start.format('ddd Do MMM'),
      time: start.format('LT')
    }
  })

  return mustache.render(template, {occurrences})
}

Object.assign(exports, {render})
