'use strict'

const mustache = require('mustache')

const template = require('./calendar.html')

function make ({citySlug}) {
  function render ({city}) {
    return mustache.render(
      template,
      {
        city
      }
    )
  }

  function initialize () {
  }

  return {render, initialize}
}

Object.assign(exports, {make})
