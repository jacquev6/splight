'use strict'

const bootstrap = require('bootstrap') // eslint-disable-line
const jQuery = require('jquery')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const body = require('../body')

jQuery(() => {
  body.make().initialize()
})
