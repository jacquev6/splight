'use strict'

const jQuery = require('jquery')
const moment = require('moment')
const mustache = require('mustache')

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
        start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)

        const day = start.format(moment.HTML5_FMT.DATE)
        var dayEvents = dayEventsByDate[day]
        if (!dayEvents) {
          dayEventsByDate[day] = dayEvents = []
        }

        dayEvents.push({
          id,
          time: start.format(moment.HTML5_FMT.TIME),
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
        events: (dayEventsByDate[d.format(moment.HTML5_FMT.DATE)] || []).sort(
          (a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0
        )
      })
    }

    const events = data.city.events.map(({id, location, artist, occurrences, tags, title}) => {
      const event = {
        id,
        title,
        location,
        tags: tags.map(({slug, title}) => ({slug, title, first: slug === tags[0].slug})),
        occurrences: occurrences.map(({start}) => {
          start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)

          return {
            date: start.format('ddd Do MMM'),
            time: start.format('LT')
          }
        }),
        artist
      }

      event.details = {html: eventDetails.render({city, event})}

      return event
    })

    return mustache.render(
      template,
      {
        city,
        days,
        events
      }
    )
  }

  function initialize () {
    const modal = jQuery('#sp-event-modal')

    jQuery('.sp-event')
      .css('cursor', 'pointer')
      .on('click', function () {
        const clicked = jQuery(this)
        modal.find('.sp-event-details').hide()
        modal.find('#sp-event-details-' + clicked.data('sp-event-id')).show()
        modal.modal()
      })
  }

  return {render, initialize}
}

Object.assign(exports, {make})
