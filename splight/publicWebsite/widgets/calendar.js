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

function make ({citySlug}) {
  function render (data) {
    const city = {slug: data.city.slug}

    const days = data.city.days.map(({date, events}) => ({
      date: moment(date, moment.HTML5_FMT.DATE, true).format('ddd Do MMM'),
      events: events.map(({time, title, mainTag, tags, artist, location, occurrences}) => {
        const event = {
          time,
          title,
          mainTag,
          // This is based on the knowledge that mainTag is first in the list. This could change.
          // @todo Change API to return mainTag, secondaryTags and allTags (if needed elsewhere), and use tag = [mainTag].concat(secondaryTags)
          tags: tags.map(({slug, title}) => ({slug, title, first: slug === mainTag.slug})),
          artist,
          location,
          occurrences: occurrences.map(({start}) => {
            start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)

            return {
              date: start.format('ddd Do MMM'),
              time: start.format('LT')
            }
          })
        }

        event.details = {html: eventDetails.render({city, event})}

        return event
      })
    }))

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
