'use strict'
const URI = require('urijs')

exports.makeWeek = function ({url, city, week}) {
  const uri = new URI(url || '/')
  const parts = uri.path().split('/')
  if (city) {
    parts[1] = city
    parts[3] = ''
  }
  parts[2] = week.format('GGGG-[W]WW')
  return uri.path(parts.join('/')).toString()
}
