'use strict'

/* global history */

const jQuery = require('jquery')
const mustache = require('mustache')
const URI = require('urijs')

const datetime = require('../../datetime')
const eventDetails_ = require('./eventDetails')
const template = require('./calendar.html')
const what = require('./eventDetails/what')
const when = require('./eventDetails/when')
const where = require('./eventDetails/where')

const eventDetails = eventDetails_.make({when, what, where})

function make ({citySlug, startDate, dateAfter, duration}) {
  function render (data) {
    const city = {slug: data.city.slug}

    const dayEventsByDate = {}

    data.city.events.forEach(({id, location, artist, occurrences, tags, title}) => {
      occurrences.forEach(({start}) => {
        start = datetime.datetime(start)

        const day = start.format(datetime.HTML5_FMT.DATE)
        var dayEvents = dayEventsByDate[day]
        if (!dayEvents) {
          dayEventsByDate[day] = dayEvents = []
        }

        dayEvents.push({
          id,
          time: start.format(datetime.HTML5_FMT.TIME),
          title,
          mainTag: tags[0],
          tags
        })
      })
    })

    const days = []
    for (var d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
      days.push({
        date: d.format('ddd Do MMM'),
        events: (dayEventsByDate[d.format(datetime.HTML5_FMT.DATE)] || []).sort(
          (a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0
        )
      })
    }

    const events = data.city.events.map(({id, location, artist, occurrences, tags, title, reservationPage}) => {
      const event = {id, location, artist, occurrences, tags, title, reservationPage}

      event.details = {html: eventDetails.render({city, event})}

      return event
    })

    return mustache.render(template, {city, days, events})
  }

  function initialize () {
    const modal = jQuery('#sp-event-modal')

    modal.on('hidden.bs.modal', function (e) {
      history.replaceState(null, '', URI(window.location.href).fragment('').toString())
    })

    function showModal (eventId) {
      modal.find('.sp-event-details').hide()
      modal.find('#sp-event-details-' + eventId).show()
      modal.modal()
      history.replaceState(null, '', URI(window.location.href).fragment(eventId).toString())
    }

    jQuery('.sp-event')
      .css('cursor', 'pointer')
      .on('click', function () {
        showModal(jQuery(this).data('sp-event-id'))
      })

    const eventId = URI.parse(window.location.href).fragment
    if (eventId) {
      showModal(eventId)
    }
  }

  return {render, initialize}
}

Object.assign(exports, {make})
