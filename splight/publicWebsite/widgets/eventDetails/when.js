'use strict'

const mustache = require('mustache')

const template = '<ul>{{#event.occurrences}}<li>Le {{date}} à {{time}}</li>{{/event.occurrences}}</ul>'

function render ({event}) {
  return mustache.render(template, {event})
}

Object.assign(exports, {render})
