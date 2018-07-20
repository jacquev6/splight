'use strict'

const title = require('./title')

function make () {
  return title.make({
    text: 'Splight',
    header: {
      html: '<a href="/">Splight</a>'
    },
    lead: {
      html: 'Votre agenda culturel régional'
    }
  })
}

exports.make = make
