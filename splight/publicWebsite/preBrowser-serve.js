'use strict'

const URI = require('urijs')

function register (path) {
  console.log('preBrowser.register', path)
}

function go ({url, overrideQuery}) {
  url = URI.parse(url)
  const newUrl = URI(window.location.href).path(url.path)
  if (overrideQuery) {
    newUrl.query(url.query || '')
  }
  window.location = newUrl.toString()
}

Object.assign(exports, {register, go})
