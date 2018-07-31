'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')

const template = require('./addEventForm.html')
const utils = require('../utils')

const {fillSelect} = utils

function make ({publicIFrame}) {
  const html = mustache.render(template, {})

  var citySlug = null

  async function submit () {
    const putArtist = jQuery('#spa-add-event-new-artist').is(':visible')
    const artist = putArtist ? {
      slug: jQuery('#spa-add-event-new-artist-slug').val(),
      name: jQuery('#spa-add-event-new-artist-name').val()
    } : {slug: jQuery('#spa-add-event-artist').val(), name: ''}

    const putLocation = jQuery('#spa-add-event-new-location').is(':visible')
    const location = putLocation ? {
      citySlug,
      slug: jQuery('#spa-add-event-new-location-slug').val(),
      name: jQuery('#spa-add-event-new-location-name').val()
    } : {citySlug, slug: jQuery('#spa-add-event-location').val(), name: ''}

    const event = {
      citySlug,
      occurences: jQuery('#spa-add-event-occurences input').map((index, start) => ({start: jQuery(start).val()})).get(),
      tags:
        [
          jQuery('#spa-add-event-main-tag').val()
        ].concat(
          jQuery('#spa-add-event-secondary-tags input:checked').map((index, tag) => jQuery(tag).val()).get()
        ),
      title: jQuery('#spa-add-event-title').val(),
      location: location.slug,
      artist: artist.slug === '-' ? undefined : artist.slug
    }

    const variableValues = {putArtist, artist, putLocation, location, event}
    console.log('addEventForm.submit', variableValues)

    await utils.request({
      requestString: 'mutation($putArtist:Boolean!,$artist:IArtist!,$putLocation:Boolean!,$location:ILocation!,$event:IEvent!){putArtist(artist:$artist)@include(if:$putArtist){slug}putLocation(location:$location)@include(if:$putLocation){slug}addEvent(event:$event){title}}',
      variableValues
    })
  }

  async function initialize (citySlug_) {
    citySlug = citySlug_

    fillSelect(
      jQuery('#spa-add-event-artist'),
      (await utils.request({requestString: '{artists {slug name}}'})).artists.map(({slug, name}) =>
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

    const tags = (await utils.request({requestString: 'query($citySlug:ID!){city(slug:$citySlug){tags{slug title}}}', variableValues: {citySlug}})).city.tags
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
      (await utils.request({requestString: 'query($citySlug:ID!){city(slug:$citySlug){locations{slug name}}}', variableValues: {citySlug}})).city.locations.map(({slug, name}) =>
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
