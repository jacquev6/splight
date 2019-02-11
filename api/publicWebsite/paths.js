'use strict'

function root () {
  return '/'
}

function city (citySlug) {
  return '/' + citySlug + '/'
}

function timespan (citySlug, startDate, duration) {
  return '/' + citySlug + '/' + startDate.format(duration.slugFormat) + '/'
}

Object.assign(exports, {root, city, timespan})
