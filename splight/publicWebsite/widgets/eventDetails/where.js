'use strict'

const mustache = require('mustache')

const template = '<p>{{event.location.name}}</p>'

function render ({event}) {
  return mustache.render(template, {event})
}

Object.assign(exports, {render})
