'use strict'

/* global history */

const jQuery = require('jquery')
const URI = require('urijs')

function make (pageOfPath) {
  const registeredPaths = {}

  async function preload (path) {
    const page = pageOfPath(path)

    await page.title.text
    // Build DOM elements to pre-fetch external resources like images
    const titleElement = jQuery(await page.title.html)
    const contentElement = jQuery(await page.content.html)

    return {page, titleElement, contentElement}
  }

  function register (path) {
    if (!registeredPaths[path]) {
      registeredPaths[path] = preload(path)
    }
    return registeredPaths[path]
  }

  async function go ({url, overrideQuery}) {
    url = URI.parse(url)
    const {page, titleElement, contentElement} = await register(url.path)
    const newUrl = URI(window.location.href).path(url.path)
    if (overrideQuery) {
      newUrl.query(url.query || '')
    }
    history.replaceState(null, '', newUrl.toString())
    // @todo Should these updates be a method of the page object?
    jQuery('title').text(await page.title.text)
    jQuery('#sp-jumbotron').html(titleElement)
    jQuery('#sp-content').html(contentElement)
    page.initialize()
  }

  function initialize () {
    const links = jQuery("a[href^='/']")
    links.off('click')
    links.on('click', function (event) {
      if (event.ctrlKey || event.altKey || event.metaKey) {
        return true
      } else {
        go({url: jQuery(this).attr('href'), overrideQuery: true})
        return false
      }
    })
    links.each(function () {
      register(URI.parse(jQuery(this).attr('href')).path)
    })
  }

  return {register, go, initialize}
}

exports.make = make
