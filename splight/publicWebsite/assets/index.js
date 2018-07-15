'use strict'

/* global history, setTimeout */

const path = require('path')

const $ = global.jQuery = require('jquery')
require('bootstrap')
const moment = require('moment')
const URI = require('urijs')

const fetcher = (function () {
  var data = {}

  function get (key) {
    if (!data[key]) {
      data[key] = $.getJSON('/' + key + '.json')
    }
    return data[key]
  }
  
  return {
    getCities: function () {
      return get('cities')
    },

    getCityWeek: function (citySlug, week) {
      return get(path.join(citySlug, week.format('GGGG-[W]WW')))
    }
  }
}())

const pages = require('../pages')(fetcher)

$(async function () {
  const page = pages.fromUrl(window.location.href)

  function handleInternalLinkClick (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return true
    } else {
      const path = $(this).attr('href')
      $('.sp-modern').addClass('sp-loading')
      const page = pages.fromUrl(path)

      page.make().then(async ({title, jumbotron, content}) => {
        $('title').text(title)
        $('#sp-jumbotron').html(jumbotron)
        $('#sp-content').html(content)

        $("#sp-jumbotron a[href^='/'], #sp-content a[href^='/']").on('click', handleInternalLinkClick)
        await page.initializeInBrowser()
        history.replaceState(null, window.document.title, URI(window.location.href).path(path).toString())
        $('.sp-modern').removeClass('sp-loading')
      })

      return false
    }
  }

  $("a[href^='/']").on('click', handleInternalLinkClick)
  await page.initializeInBrowser()
  $('.sp-modern').removeClass('sp-loading')
})
