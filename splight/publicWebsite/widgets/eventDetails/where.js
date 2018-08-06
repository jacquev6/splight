'use strict'

const mustache = require('mustache')

const template = '<p>{{location.name}}</p>'

function render ({event: {location}}) {
  return mustache.render(template, {location})
}

Object.assign(exports, {render})
