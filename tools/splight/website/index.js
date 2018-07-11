'use strict'

const $ = global.jQuery = require('jquery')
require('bootstrap')

// We'll need to pass in a source that fetches data files from the server
const pages = require('../pages')({getCities: true, getCity: true, getTags: true, getEvents: true})

$(function () {
  const page = pages.fromUrl(window.location.href)

  /* This is probably how we will implement AJAX navigation:
    - add handler to all internal links
    - recreate the staticContent (rename that, obviously when it's not static anymore) based on the url clicked
    - return false
  To let users open new tabs with CTRL+click: if CTRL is down during click then just return true */
  $("a[href^='/']").on('click', function () {
    console.log('Internal link to', $(this).attr('href'), 'clicked')
    return true
  })

  page.initializeInBrowser().then(
    () => $('.sp-modern').removeClass('sp-loading')
  )
})
