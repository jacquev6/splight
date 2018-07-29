'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const publicWebsite = require('./splight/publicWebsite')

publicWebsite.generate({
  dataDirectory: process.argv[2],
  outputDirectory: process.argv[3]
})
