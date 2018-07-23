'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')

const template = require('./addEventForm.html')
const restApiClient = require('../restApiClient')
const utils = require('../utils')

const {fillSelect} = utils

function make ({publicIFrame}) {
  const html = mustache.render(template, {})

  var citySlug = null

  async function submit () {
    const event = {
      artist: jQuery('#spa-add-event-new-artist').is(':visible')
        ? {
          slug: jQuery('#spa-add-event-new-artist-slug').val(),
          name: jQuery('#spa-add-event-new-artist-name').val()
        }
        : jQuery('#spa-add-event-artist').val(),
      location: jQuery('#spa-add-event-new-location').is(':visible')
        ? {
          slug: jQuery('#spa-add-event-new-location-slug').val(),
          name: jQuery('#spa-add-event-new-location-name').val()
        }
        : jQuery('#spa-add-event-location').val(),
      occurences: jQuery('#spa-add-event-occurences input').map((index, start) => ({start: jQuery(start).val()})).get(),
      tags:
        [
          jQuery('#spa-add-event-main-tag').val()
        ].concat(
          jQuery('#spa-add-event-secondary-tags input:checked').map((index, tag) => jQuery(tag).val()).get()
        ),
      title: jQuery('#spa-add-event-title').val()
    }

    const response = await restApiClient.addEvent({citySlug, event})
    publicIFrame.show(response.visible_at[0])
    initialize(citySlug)
  }

  async function initialize (citySlug_) {
    citySlug = citySlug_

    fillSelect(
      jQuery('#spa-add-event-artist'),
      (await restApiClient.getArtists()).map(({slug, name}) =>
        ({value: slug, display: name})
      )
    )
    jQuery('#spa-add-event-artist').show()
    jQuery('#spa-add-event-add-artist').show()
    jQuery('#spa-add-event-new-artist').hide()
    jQuery('#spa-add-event-add-artist')
      .off('click')
      .on('click', () => {
        jQuery('#spa-add-event-artist').hide()
        jQuery('#spa-add-event-add-artist').hide()
        jQuery('#spa-add-event-new-artist').show()
      })

    const tags = await restApiClient.getTags({citySlug})
    const mainTag = jQuery('#spa-add-event-main-tag')
    const secondaryTags = jQuery('#spa-add-event-secondary-tags')
    fillSelect(
      mainTag,
      tags.map(({slug, title}) =>
        ({value: slug, display: title})
      )
    )
    secondaryTags.empty()
    tags.forEach(({slug, title}) => {
      secondaryTags.append(' <label>' + title + ' <input type="checkbox" value="' + slug + '"></label>')
    })
    mainTag.on('change', () => {
      secondaryTags
        .find('input').attr('disabled', false)
        .filter('[value=' + mainTag.val() + ']').prop('checked', false).attr('disabled', true)
    })

    fillSelect(
      jQuery('#spa-add-event-location'),
      (await restApiClient.getLocations({citySlug})).map(({slug, name}) =>
        ({value: slug, display: name})
      )
    )
    jQuery('#spa-add-event-location').show()
    jQuery('#spa-add-event-add-location').show()
    jQuery('#spa-add-event-new-location').hide()
    jQuery('#spa-add-event-add-location')
      .off('click')
      .on('click', () => {
        jQuery('#spa-add-event-location').hide()
        jQuery('#spa-add-event-add-location').hide()
        jQuery('#spa-add-event-new-location').show()
      })

    const occurences = jQuery('#spa-add-event-occurences')
    const occurenceInput = ' <input type="datetime-local"></input>'
    occurences.html(occurenceInput)
    jQuery('#spa-add-event-add-occurence')
      .off('click')
      .on('click', () => { occurences.append(occurenceInput) })

    jQuery('#spa-add-event-cancel').on('click', () => {
      initialize(citySlug)
    })

    jQuery('#spa-add-event')
      .off('submit')
      .on('submit', () => {
        submit()
        return false
      })
  }

  return {html, initialize}
}

exports.make = make
