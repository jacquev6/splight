'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')

const template = require('./addEventForm.html')
const restApiClient = require('../restApiClient')
const utils = require('../utils')

const {fillSelect} = utils

function make ({publicIFrame}) {
  const html = mustache.render(template, {})

  async function submit () {
    const citySlug = jQuery('#spa-select-city').val()
    const event = {
      artist: jQuery('#spa-add-event-artist').val(),
      location: jQuery('#spa-add-event-location').val(),
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
  }

  async function initialize (citySlug) {
    fillSelect(
      jQuery('#spa-add-event-artist'),
      (await restApiClient.getArtists()).map(({slug, name}) =>
        ({value: slug, display: name})
      )
    )

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

    const occurences = jQuery('#spa-add-event-occurences')
    const occurenceInput = ' <input type="datetime-local"></input>'
    occurences.html(occurenceInput)
    jQuery('#spa-add-event-add-occurence')
      .off('click')
      .on('click', () => { occurences.append(occurenceInput) })

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
