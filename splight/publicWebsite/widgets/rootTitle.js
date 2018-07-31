'use strict'

const title = require('./title')

function make () {
  return title.make({
    text: data => 'Splight',
    header: {
      render: data => '<a href="/">Splight</a>'
    },
    lead: {
      render: data => 'Votre agenda culturel régional'
    }
  })
}

Object.assign(exports, {make})
