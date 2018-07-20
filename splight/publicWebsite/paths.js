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

exports.root = root
exports.city = city
exports.timespan = timespan
