'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')

const template = require('./calendar.html')

function make ({citySlug}) {
  function render ({city}) {
    return mustache.render(
      template,
      {
        city
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
