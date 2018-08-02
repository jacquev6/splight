'use strict'

const mustache = require('mustache')

const template = require('./where.html')

function render ({city, event}) {
  return mustache.render(
    template,
    {
      city,
      event
    }
  )
}

Object.assign(exports, {render})
