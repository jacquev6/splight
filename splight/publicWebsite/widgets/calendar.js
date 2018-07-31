'use strict'

const jQuery = require('jquery')
const moment = require('moment')
const mustache = require('mustache')

const template = require('./calendar.html')

function make ({citySlug}) {
  function render (data) {
    const city = {slug: data.city.slug}

    const days = data.city.days.map(({date, events}) => ({
      date: moment(date, moment.HTML5_FMT.DATE, true).format('ddd Do MMM'),
      events: events.map(({time, title, mainTag, tags, artist, location, occurences}) => ({
        time,
        title,
        mainTag,
        tags,
        artist,
        location,
        occurences: occurences.map(({start}) => {
          start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)

          return {
            date: start.format('ddd Do MMM'),
            time: start.format('LT')
          }
        })
      }))
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
        const clicked = $(this)
        modal.find('.modal-title').text(clicked.find('.sp-event-title').text())
        modal.find('.modal-body').html(clicked.find('.sp-event-details').html())
        modal.modal()
      })
  }

  return {render, initialize}
}

Object.assign(exports, {make})
