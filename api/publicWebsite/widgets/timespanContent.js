'use strict'

const mustache = require('mustache')

const calendar_ = require('./calendar')
const linksToolbar_ = require('./linksToolbar')
const tagFilter_ = require('./tagFilter')
const template = require('./timespanContent.html')

function make ({citySlug, startDate, dateAfter, duration}) {
  const tagFilter = tagFilter_.make({citySlug, startDate, dateAfter, duration})
  const linksToolbar = linksToolbar_.make({citySlug, startDate, dateAfter, duration})
  const calendar = calendar_.make({citySlug, startDate, dateAfter, duration})

  function render (data) {
    return mustache.render(
      template,
      {
        title: startDate.format(duration.titleFormat),
        tagFilter: {html: tagFilter.render(data)},
        linksToolbar: {html: linksToolbar.render(data)},
        calendar: {html: calendar.render(data)}
      }
    )
  }

  function initialize () {
    tagFilter.initialize()
    linksToolbar.initialize()
    calendar.initialize()
  }

  return {
    render,
    initialize
  }
}

Object.assign(exports, {make})