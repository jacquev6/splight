'use strict'

const mustache = require('mustache')

const datetime = require('../../../datetime')
const template = '<ul>{{#occurrences}}<li>Le {{date}} à {{time}}</li>{{/occurrences}}</ul>'

function render ({event: {occurrences}}) {
  occurrences = occurrences.map(({start}) => {
    start = datetime.datetime(start)

    return {
      date: start.format('ddd Do MMM'),
      time: start.format('LT')
    }
  })

  return mustache.render(template, {occurrences})
}

Object.assign(exports, {render})
