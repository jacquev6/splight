'use strict'

/* global history */

const jQuery = require('jquery')
const moment = require('moment')
const mustache = require('mustache')
const URI = require('urijs')

const pages = require('../pages')
const paths = require('../paths')
const durationSelector_ = require('./durationSelector')
const template = require('./timespanContent.html')

function make ({citySlug, startDate, duration}) {
  const durationSelector = durationSelector_.make({citySlug, startDate, duration})
  // @todo Split this into several small widgets like durationSelector

  function makePath (d) {
    return paths.timespan(citySlug, d, duration)
  }

  function makeLinks (now) {
    function make (desc, d) {
      return {text: desc.text, path: makePath(desc.startDate(d))}
    }
    return {
      previous: make(duration.links.previous, startDate),
      next: make(duration.links.next, startDate),
      now1: make(duration.links.now1, now),
      now2: make(duration.links.now2, now)
    }
  }

  function render (data) {
    const city = data.city
    city.days.forEach(day => {
      day.date = moment(day.date, moment.HTML5_FMT.DATE, true).format('ddd Do MMM')
    })

    const now = moment()
    const links = makeLinks(now)
    // @todo Hide link to previous before now
    links.previous.path = pages.timespan(citySlug, duration.links.previous.startDate(startDate), duration).exists(data) && links.previous.path
    links.next.path = pages.timespan(citySlug, duration.links.next.startDate(startDate), duration).exists(data) && links.next.path

    return mustache.render(
      template,
      {
        city,
        title: startDate.format(duration.titleFormat),
        links,
        durationSelector: {html: durationSelector.render()}
      }
    )
  }

  function initialize () {
    const links = makeLinks(moment())

    jQuery('.sp-timespan-now-1').attr('href', (index, href) => URI(href).path(links.now1.path).toString())
    jQuery('.sp-timespan-now-2').attr('href', (index, href) => URI(href).path(links.now2.path).toString())

    const allTags = new Set(jQuery('#sp-tag-filtering input').map((index, input) => jQuery(input).val()).toArray())
    const query = URI.parseQuery(URI.parse(window.location.href).query)
    if (Object.keys(query).length === 0) {
      jQuery('#sp-tag-filtering input').prop('checked', true)
    } else {
      const displayedTags = new Set(Object.keys(query))
      jQuery('#sp-tag-filtering input').each(function (index, input) {
        input = jQuery(input)
        input.prop('checked', displayedTags.has(input.val()))
      })
    }

    function filterEvents () {
      jQuery('.sp-event').hide()
      const displayedTags = new Set()
      jQuery('#sp-tag-filtering input').each(function (index, input) {
        input = jQuery(input)
        const tag = input.val()
        if (input.prop('checked')) {
          displayedTags.add(tag)
          jQuery('.sp-tag-' + citySlug + '-' + tag).show()
        }
      })

      const newQuery = displayedTags.size === allTags.size ? '' : Array.from(displayedTags).sort().join('&')
      jQuery('.sp-tag-filtering-tagged-link').attr('href', function (index, href) {
        return URI(href).query(newQuery).toString()
      })
      history.replaceState(null, '', URI(window.location.href).query(newQuery).toString())
    }

    filterEvents()
    jQuery('#sp-tag-filtering input').on('change', filterEvents)
  }

  return {
    render,
    initialize
  }
}

exports.make = make
