'use strict'

/* global history, Image */

const jQuery = require('jquery')
const URI = require('urijs')

function make (pageOfPath) {
  const registeredPaths = {}

  async function preload (path) {
    const page = pageOfPath(path)

    // @todo Could we render the title and content html instead of explicitly listing images?
    // There could (will) be other resources than images, so a more generic method would be more robust
    ;(await page.images()).forEach(image => {
      new Image().src = image
    })

    await Promise.all([page.title.text, page.title.html, page.content.html])

    return page
  }

  function register (path) {
    if (!registeredPaths[path]) {
      registeredPaths[path] = preload(path)
    }
    return registeredPaths[path]
  }

  async function go ({url, overrideQuery}) {
    url = URI.parse(url)
    const page = await register(url.path)
    const newUrl = URI(window.location.href).path(url.path)
    if (overrideQuery) {
      newUrl.query(url.query || '')
    }
    history.replaceState(null, '', newUrl.toString())
    // @todo Should these updates be a method of the page object?
    jQuery('title').text(await page.title.text)
    jQuery('#sp-jumbotron').html(await page.title.html)
    jQuery('#sp-content').html(await page.content.html)
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
