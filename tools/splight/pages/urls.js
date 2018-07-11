'use strict'

const URI = require('urijs')

exports.makeCity = function ({url, city}) {
  const uri = new URI(url || '/')
  return uri.path(
    ['', city, ''].join('/')
  ).toString()
}

exports.makeTimespan = function ({url, city, timespanSlug}) {
  const uri = new URI(url || '/')
  return uri.path(
    ['', city || uri.path().split('/')[1], timespanSlug, ''].join('/')
  ).toString()
}

exports.makeWeek = function ({url, city, week}) {
  return exports.makeTimespan({url, city, timespanSlug: week.format('GGGG-[W]WW')})
}
