'use strict'

// @todo Restore hasModernJavascript test
const bootstrap = require('bootstrap') // eslint-disable-line
const jquery = require('jquery')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line
const URI = require('urijs')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const pages = require('../pages')
// @todo Use preBrowser-generate
const preBrowser = require('../preBrowser-serve')

jquery(function () {
  const config = {preBrowser}
  const page = pages.fromPath(URI.parse(window.location.href).path)
  page.title.initialize(config)
  page.content.initialize(config)
})
