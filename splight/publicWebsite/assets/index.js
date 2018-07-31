'use strict'

/* global Modernizr */

const assert = require('assert').strict
assert(false) // This is removed by the unassertify plugin of browserify

var hasModernJavascript = true

for (var k in Modernizr) {
  if (Modernizr.hasOwnProperty(k)) {
    if (!Modernizr[k]) {
      console.log('Not running JavaScript because of missing feature:', k)
      hasModernJavascript = false
    }
  }
}

if (hasModernJavascript) {
  const bootstrap = require('bootstrap') // eslint-disable-line
  const jQuery = require('jquery')
  const moment = require('moment')
  const moment_fr = require('moment/locale/fr') // eslint-disable-line
  const URI = require('urijs')

  // @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
  moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

  const pages = require('../pages')

  jQuery(function () {
    const page = pages.fromPath(URI.parse(window.location.href).path)
    page.content.initialize()
  })
}
