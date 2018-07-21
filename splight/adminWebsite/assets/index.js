'use strict'

const bootstrap = require('bootstrap') // eslint-disable-line
const jQuery = require('jquery')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const restApiClient = require('../restApiClient')

function fillSelect (select, options) {
  select.html('<option value="-">-</option>')
  options.forEach(({value, display}) => {
    select.append('<option value="' + value + '">' + display + '</option>')
  })
}

jQuery(() => {
  restApiClient.getArtists().then(artists => {
    fillSelect(
      jQuery('#spa-add-event-artist'),
      artists.map(({slug, name}) => ({value: slug, display: name}))
    )
  })

  restApiClient.getCities().then(cities => {
    const select = jQuery('#spa-select-city')
    select.on('change', () => {
      jQuery('#spa-city').hide()
      const citySlug = select.val()
      if (citySlug !== '-') {
        jQuery.when(
          restApiClient.getTags({citySlug}).then(tags => {
            fillSelect(
              jQuery('#spa-add-event-tag'),
              tags.map(({slug, title}) => ({value: slug, display: title}))
            )
          }),

          restApiClient.getLocations({citySlug}).then(locations => {
            fillSelect(
              jQuery('#spa-add-event-location'),
              locations.map(({slug, name}) => ({value: slug, display: name}))
            )
          })
        ).then(() => {
          jQuery('#spa-city').show()
        })
      }
    })
    fillSelect(
      select,
      cities.map(({slug, name}) => ({value: slug, display: name}))
    )
  })

  jQuery('#spa-add-event').on('submit', () => {
    const citySlug = jQuery('#spa-select-city').val()
    const event = {
      occurences: [
        {start: jQuery('#spa-add-event-start').val()}
      ],
      title: jQuery('#spa-add-event-title').val(),
      tags: [jQuery('#spa-add-event-tag').val()],
      location: jQuery('#spa-add-event-location').val()
    }

    restApiClient.addEvent({citySlug, event}).then(response => {
      jQuery('#spa-public').attr('src', response.visible_at[0])
    })

    return false
  })
})
