'use strict'

const $ = global.jQuery = require('jquery')
require('bootstrap')

const pages = require('../pages')

$(function () {
  const page = pages.fromUrl(window.location.href)

  page.initializeInBrowser().then(
    () => $('.sp-modern').removeClass('sp-loading')
  )
})
