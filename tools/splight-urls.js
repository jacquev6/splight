'use strict'
const URI = require('urijs')

exports.makeWeek = function ({url, city, week}) {
  const uri = new URI(url || '/')
  return uri.path(
    ['', city || uri.path().split('/')[1], week.format('GGGG-[W]WW'), ''].join('/')
  ).toString()
}
