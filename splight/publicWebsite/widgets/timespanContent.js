'use strict'

/* global history */

const jQuery = require('jquery')
const moment = require('moment')
const mustache = require('mustache')
const URI = require('urijs')

const paths = require('../paths')
const durationSelector_ = require('./durationSelector')
const template = require('./timespanContent.html')

function make ({source, preBrowser, citySlug, startDate, duration}) {
  startDate = duration.clip(startDate)
  const dateAfter = duration.dateAfter(startDate)

  const durationSelector = durationSelector_.make({preBrowser, citySlug, startDate, duration})
  // @todo Split this into several small widgets like durationSelector

  const city = source.getCity(citySlug)
  const events = source.getEvents(citySlug, startDate, dateAfter)

  function makePath (d) {
    return paths.timespan(citySlug, d, duration)
  }

  const links = {
    previous: {text: duration.links.previous.text, path: makePath(duration.links.previous.startDate(startDate))},
    next: {text: duration.links.next.text, path: makePath(duration.links.next.startDate(startDate))},
    now1: {text: duration.links.now1.text, path: makePath(duration.links.now1.startDate(source.getNow()))},
    now2: {text: duration.links.now2.text, path: makePath(duration.links.now2.startDate(source.getNow()))}
  }

  return {
    html: (async () => {
      const eventsByDay = {}

      for (var d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
        eventsByDay[d.format(moment.HTML5_FMT.DATE)] = []
      }

      (await events).forEach(function ({title, start, tags}) {
        eventsByDay[start.format(moment.HTML5_FMT.DATE)].push({
          title,
          time: start.format('LT'),
          mainTag: tags[0],
          tags
        })
      })

      const days = []

      for (d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
        days.push({
          date: d.format('ddd Do MMM'),
          events: eventsByDay[d.format(moment.HTML5_FMT.DATE)]
        })
      }

      try {
        await source.getEvents(citySlug, startDate.clone().subtract(1, 'day'), startDate)
        links.previous.exists = true
      } catch (e) {
        links.previous.exists = false
      }
      try {
        await source.getEvents(citySlug, dateAfter, dateAfter.clone().add(1, 'day'))
        links.next.exists = true
      } catch (e) {
        links.next.exists = false
      }

      return mustache.render(
        template,
        {
          city: await city,
          title: startDate.format(duration.titleFormat),
          days,
          links,
          durationSelector: {html: await durationSelector.html}
        }
      )
    })(),
    initialize: () => {
      jQuery('.sp-timespan-now-1').attr('href', (index, href) => URI(href).path(links.now1.path).toString())
      jQuery('.sp-timespan-now-2').attr('href', (index, href) => URI(href).path(links.now2.path).toString())

      durationSelector.initialize()

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
  }
}

exports.make = make
