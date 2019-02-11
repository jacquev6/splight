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
  const URI = require('urijs')

  const pages = require('../pages')
  const preBrowser = require('../preBrowser')

  jQuery(function () {
    const page = pages.fromPath(URI.parse(window.location.href).path)
    page.content.initialize()
    preBrowser.initialize()
  })
}
