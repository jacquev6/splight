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

    data.city.events.forEach(({location, artist, occurrences, tags, title}) => {
      occurrences.forEach(({start}) => {
        start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)
        const mainTag = tags[0]
        const event = {
          time: start.format(moment.HTML5_FMT.TIME),
          title,
          location,
          tags: tags.map(({slug, title}) => ({slug, title, first: slug === mainTag.slug})),
          mainTag,
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

        const day = start.format(moment.HTML5_FMT.DATE)
        var dayEvents = dayEventsByDate[day]
        if (!dayEvents) {
          dayEventsByDate[day] = dayEvents = []
        }

        dayEvents.push(event)
      })
    })

    for (var date in dayEventsByDate) {
      dayEventsByDate[date] = dayEventsByDate[date].sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0)
    }

    const days = []
    for (var d = startDate.clone(); d.isBefore(dateAfter); d.add(1, 'day')) {
      const date = d.format(moment.HTML5_FMT.DATE)
      days.push({
        date: d.format('ddd Do MMM'),
        events: dayEventsByDate[date] || []
      })
    }

    return mustache.render(
      template,
      {
        city,
        days
      }
    )
  }

  function initialize () {
    const modal = jQuery('#sp-event-modal')

    jQuery('.sp-event')
      .css('cursor', 'pointer')
      .on('click', function () {
        const clicked = jQuery(this)
        modal.find('.modal-title').text(clicked.find('.sp-event-title').text())
        modal.find('.modal-body').html(clicked.find('.sp-event-details').html())
        modal.modal()
      })
  }

  return {render, initialize}
}

Object.assign(exports, {make})
