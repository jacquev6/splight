'use strict'

const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const HTML5_FMT = moment.HTML5_FMT

function date (s) {
  return moment(s, HTML5_FMT.DATE, true)
}

function datetime (s) {
  return moment(s, HTML5_FMT.DATETIME_LOCAL, true)
}

function generationNow () {
  return moment()
}

function visitNow () {
  return moment()
}

Object.assign(exports, {date, datetime, HTML5_FMT, generationNow, visitNow})
