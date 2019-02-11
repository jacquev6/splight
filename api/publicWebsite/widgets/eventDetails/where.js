'use strict'

const locationDetails = require('./locationDetails')

function render ({event: {location}}) {
  return locationDetails.render({location})
}

Object.assign(exports, {render})
