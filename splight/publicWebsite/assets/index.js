'use strict'

/* global history, setTimeout */

const assert = require('assert')
const bootstrap = require('bootstrap') // eslint-disable-line
const jquery = require('jquery')
const moment = require('moment')
const path = require('path')
const URI = require('urijs')

// @todo Remove when https://github.com/moment/moment/issues/4698 is fixed on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'
assert.equal(moment.HTML5_FMT.WEEK, 'GGGG-[W]WW')

const fetcher = (function () {
  const data = {}

  function get (key) {
    if (!data[key]) {
      data[key] = jquery.getJSON('/' + key + '.json')
    }
    return data[key]
  }

  return {
    getCities: function () {
      return get('cities')
    },

    getCityWeek: function (citySlug, week) {
      return get(path.join(citySlug, week.format(moment.HTML5_FMT.WEEK)))
    }
  }
}())

const pages = require('../pages')(fetcher)

jquery(async function () {
  const page = pages.fromUrl(window.location.href)

  function handleInternalLinkClick (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return true
    } else {
      const url = URI.parse(jquery(this).attr('href'))
      jquery('.sp-modern').addClass('sp-loading')
      const page = pages.fromUrl(url.path)

      page.make().then(async ({title, jumbotron, content}) => {
        jquery('title').text(title)
        jquery('#sp-jumbotron').html(jumbotron)
        jquery('#sp-content').html(content)

        jquery("#sp-jumbotron a[href^='/'], #sp-content a[href^='/']").on('click', handleInternalLinkClick)
        history.replaceState(null, window.document.title, URI(window.location.href).path(url.path).query(url.query || '').toString())
        await page.initializeInBrowser()
        jquery('.sp-modern').removeClass('sp-loading')
      })

      return false
    }
  }

  jquery("a[href^='/']").on('click', handleInternalLinkClick)
  await page.initializeInBrowser()
  jquery('.sp-modern').removeClass('sp-loading')
})
