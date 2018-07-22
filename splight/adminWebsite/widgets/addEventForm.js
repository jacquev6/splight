'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')

const template = require('./addEventForm.html')
const restApiClient = require('../restApiClient')
const utils = require('../utils')

const {fillSelect} = utils

function make ({publicIFrame}) {
  const html = mustache.render(template, {})

  async function submit() {
    const citySlug = jQuery('#spa-select-city').val()
    const event = {
      occurences: [
        {start: jQuery('#spa-add-event-start').val()}
      ],
      title: jQuery('#spa-add-event-title').val(),
      tags: [jQuery('#spa-add-event-main-tag').val()],
      location: jQuery('#spa-add-event-location').val()
    }

    const response = await restApiClient.addEvent({citySlug, event})
    publicIFrame.show(response.visible_at[0])
  }

  async function initialize (citySlug) {
    fillSelect(
      jQuery('#spa-add-event-artist'),
      (await restApiClient.getArtists()).map(({slug, name}) =>
        ({value: slug, display: name})
      )
    )

    fillSelect(
      jQuery('#spa-add-event-main-tag'),
      (await restApiClient.getTags({citySlug})).map(({slug, title}) =>
        ({value: slug, display: title})
      )
    )

    fillSelect(
      jQuery('#spa-add-event-location'),
      (await restApiClient.getLocations({citySlug})).map(({slug, name}) =>
        ({value: slug, display: name})
      )
    )

    const form = jQuery('#spa-add-event')
    form.off('submit')
    form.on('submit', () => {
      submit()
      return false
    })
  }

  return {html, initialize}
}

exports.make = make
