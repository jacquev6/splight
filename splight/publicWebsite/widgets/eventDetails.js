'use strict'

const mustache = require('mustache')

const template = require('./eventDetails.html')

function make ({when, what, where}) {
  function render (data) {
    return mustache.render(
      template,
      Object.assign(
        {
          when: {html: when.render(data)},
          what: {html: what.render(data)},
          where: {html: where.render(data)}
        },
        data
      )
    )
  }

  return {render}
}

Object.assign(exports, {make})
