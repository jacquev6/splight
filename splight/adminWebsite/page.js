'use strict'

const jQuery = require('jquery')
const moment = require('moment')
const mustache = require('mustache')

const template = require('./page.html')
const eventsTemplate = require('./widgets/events.html')

const eventDetails_ = require('../publicWebsite/widgets/eventDetails')
const what = require('../publicWebsite/widgets/eventDetails/what')
const when = require('../publicWebsite/widgets/eventDetails/when')
const where = require('../publicWebsite/widgets/eventDetails/where')

const eventDetails = eventDetails_.make({when, what, where})

const filteredEvents = (function () {
  var citySlug

  function initialize (config) {
    citySlug = config.citySlug

    displayDisclaimer()

    jQuery('#spa-filter-location, #spa-filter-artist').off('change').on('change', handleFilterChange)

    var inputTimeoutId = null
    jQuery('#spa-filter-title').off('input').on('input', () => {
      clearTimeout(inputTimeoutId)
      inputTimeoutId = setTimeout(handleFilterChange, 200)
    })
  }

  async function handleFilterChange () {
    const location = jQuery('#spa-filter-location').val()
    const artist = jQuery('#spa-filter-artist').val()
    const title = jQuery('#spa-filter-title').val()

    const filter = {
      location: location === '-' ? undefined : location,
      artist: artist === '-' ? undefined : artist,
      title: title === '' ? undefined : title
    }

    if (Object.values(filter).some(x => x)) {
      const {city: {events}} = await request({
        requestString: 'query($citySlug:ID!,$location:ID,$artist:ID,$title:String){city(slug:$citySlug){events(location:$location,artist:$artist,title:$title){title artist{name} location{name} occurrences{start} tags{slug title}}}}',
        variableValues: Object.assign({citySlug}, filter)
      })

      if (events.length) {
        displayEvents(events)
      } else {
        displayNoMatchingEvents()
      }
    } else {
      displayDisclaimer()
    }
  }

  function displayEvents (events) {
    jQuery('#spa-filtered-events').html(mustache.render(
      eventsTemplate,
      {
        events: events.map(({time, title, tags, artist, location, occurrences}) => {
          const mainTag = tags[0]
          // @todo Deduplicate with publicWebsite/widgets/calendar.js
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

          return {details: {html: eventDetails.render({city: {slug: citySlug}, event})}}
        })
      }
    ))
  }

  function displayNoMatchingEvents () {
    jQuery('#spa-filtered-events').html('<p>Aucun événement ne correspond.</p>')
  }

  function displayDisclaimer () {
    jQuery('#spa-filtered-events').html('<p>Utiliser le filtre sur la gauche pour afficher les événements qui correspondent.</p>')
  }

  return {initialize}
}())

function render ({scripts}) {
  return mustache.render(
    template,
    {
      scripts
    }
  )
}

async function initialize () {
  const selectCity = jQuery('#spa-select-city')

  fillSelect(
    selectCity,
    (await request({requestString: '{cities{slug name}}'})).cities.map(({slug, name}) => ({
      value: slug,
      display: name
    }))
  )

  selectCity.on('change', async () => {
    jQuery('.spa-needs-city').hide()
    const citySlug = selectCity.val()
    if (citySlug !== '-') {
      const data = await request({
        requestString: 'query($citySlug:ID!){artists{slug name} city(slug:$citySlug){locations{slug name}}}',
        variableValues: {citySlug}
      })
      // Maybe use a https://jqueryui.com/autocomplete/#combobox for these selects
      fillSelect(
        jQuery('#spa-filter-location'),
        data.city.locations.map(({slug, name}) => ({value: slug, display: name}))
      )
      fillSelect(
        jQuery('#spa-filter-artist'),
        data.artists.map(({slug, name}) => ({value: slug, display: name}))
      )
      jQuery('#spa-filter-title').val('')
      filteredEvents.initialize({citySlug})
      jQuery('.spa-needs-city').show()
    }
  })
}

function fillSelect (select, options) {
  select.html('<option>-</option>')
  options.forEach(({value, display}) => {
    select.append('<option value="' + value + '">' + display + '</option>')
  })
}

async function request ({requestString, variableValues}) {
  const response = await jQuery.ajax({
    url: '/graphql',
    data: JSON.stringify({
      query: requestString,
      variables: variableValues
    }),
    contentType: 'application/json',
    type: 'POST',
    dataType: 'json'
  }).fail((jqXHR, textStatus, errorThrown) => {
    console.log('Error while calling GraphQL:')
    console.log('jqXHR', jqXHR)
    console.log('textStatus', textStatus)
    console.log('errorThrown', errorThrown)
  })

  return response.data
}

Object.assign(exports, {fillSelect, request})

Object.assign(exports, {render, initialize})
