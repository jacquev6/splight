'use strict'

const mustache = require('mustache')

const template = require('./what.html')

// @todo Use custom-colored badges (https://getbootstrap.com/docs/4.1/components/badge/) for the tags

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
