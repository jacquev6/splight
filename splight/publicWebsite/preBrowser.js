'use strict'

/* global history */

const jQuery = require('jquery')
const URI = require('urijs')
const deepEqual = require('deep-equal')

const pages = require('./pages')

const byPath = {}

function initialize () {
  const links = jQuery('a[href^="/"]')

  links.on('click', function (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return true
    } else {
      browse(jQuery(this).attr('href'))
      return false
    }
  })

  links.each(function (index, link) {
    preBrowse(jQuery(link).attr('href'), false)
  })
}

async function browse (url) {
  history.pushState(null, '', url)

  const cached = await preBrowse(url, false)
  updateWith(cached)

  // Check for updated data. This is mainly useful in admin website, but generic enough to apply to public website.
  const updated = await preBrowse(url, true)
  if (!deepEqual(updated.data, cached.data)) {
    updateWith(updated)
  }
}

function updateWith ({page, data, rendered: {titleText, titleHtml, contentHtml}}) {
  jQuery('title').text(titleText)
  jQuery('#sp-jumbotron').html(titleHtml)
  jQuery('#sp-content').html(contentHtml)

  page.content.initialize()

  initialize()
}

function preBrowse (url, force) {
  const path = URI.parse(url).path
  if (force || !byPath[path]) {
    byPath[path] = doPreBrowse(path)
  }
  return byPath[path]
}

async function doPreBrowse (path) {
  console.log('preBrowser.doPreBrowse', path)
  const page = pages.fromPath(path)
  const data = await jQuery.get(path + 'data.json')

  const titleText = page.title.text(data)
  // Build DOM elements to pre-fetch external resources like images
  const titleHtml = jQuery(page.title.render(data))
  const contentHtml = jQuery(page.content.render(data))

  return {page, data, rendered: {titleText, titleHtml, contentHtml}}
}

Object.assign(exports, {initialize})
