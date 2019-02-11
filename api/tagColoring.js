'use strict'

const colorConvert = require('color-convert')

function * makeSassPreamble ({cities}) {
  yield '$sp-tag-colors: ('

  for (var {slug, tags} of cities) {
    for (var i = 0; i !== tags.length; ++i) {
      const slugs = slug + '-' + tags[i].slug
      const color = colorConvert.hsv.hex(360 * i / tags.length, 100, 100)
      yield ('  "' + slugs + '": #' + color + ',')
    }
  }

  yield ');'
}

Object.assign(exports, {makeSassPreamble})
