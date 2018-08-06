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

const eventDetailsForDisplay = eventDetails_.make({when, what, where})

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
        requestString: 'query($citySlug:ID!,$location:ID,$artist:ID,$title:String){city(slug:$citySlug){events(location:$location,artist:$artist,title:$title){id title artist{name} location{name} occurrences{start} tags{slug title}}}}',
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
        events: events.map(({id, title, tags, artist, location, occurrences}) => {
          // @todo Deduplicate with publicWebsite/widgets/calendar.js
          const event = {
            id,
            title,
            location,
            tags: tags.map(({slug, title}) => ({slug, title, first: slug === tags[0].slug})),
            artist,
            occurrences: occurrences.map(({start}) => {
              start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)

              return {
                date: start.format('ddd Do MMM'),
                time: start.format('LT')
              }
            })
          }

          event.details = {html: eventDetailsForDisplay.render({city: {slug: citySlug}, event})}

          return event
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

const eventDetailsForEdit = (function () {
  const when = (function () {
    const template = `
      <ul>{{#event.occurrences}}<li>Le {{date}} à {{time}} <button class="btn btn-secondary btn-sm spa-delete-occurrence">Supprimer</button></li>{{/event.occurrences}}
      <li><input type="text" placeholder="2018-07-14T12:00"/> <button class="btn btn-secondary btn-sm spa-add-occurrence">Ajouter</button></li>
      </ul>
    `

    function render ({event}) {
      return mustache.render(
        template,
        {event}
      )
    }

    function initialize () {
      jQuery(document).on('click', 'button.spa-delete-occurrence', function () {
        console.log('Delete occurrence', jQuery('button.spa-delete-occurrence').index(this))
      })
      jQuery(document).on('click', 'button.spa-add-occurrence', function () {
        console.log('Add occurrence')
      })
    }

    return {render, initialize}
  }())

  const what = (function () {
    function render (data) {
      return ""
    }

    return {render}
  }())

  const where = (function () {
    function render (data) {
      return ""
    }

    return {render}
  }())

  const eventDetails = eventDetails_.make({when: when, what: what, where: where})

  function render (data) {
    return eventDetails.render(data)
  }

  function initialize () {
    when.initialize()
  }

  return {render, initialize}
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

  eventDetailsForEdit.initialize()

  const modal = jQuery('#spa-modify-event-modal')

  jQuery(document).on('click', '.spa-modify-event', async function () {
    const citySlug = selectCity.val()
    const eventId = jQuery(this).data('spa-event-id')
    console.log('Modify event', eventId, 'in', citySlug)

    const {city: {event: {title, location, tags, artist, occurrences}}} = await request({
      requestString: 'query($citySlug:ID!, $eventId:ID!){city(slug:$citySlug){event(id:$eventId){title location{name} tags{slug title} artist{name} occurrences{start}}}}',
      variableValues: {citySlug, eventId}
    })

    // @todo Deduplicate with publicWebsite/widgets/calendar.js
    const event = {
      title,
      location,
      tags: tags.map(({slug, title}) => ({slug, title, first: slug === tags[0].slug})),
      artist,
      occurrences: occurrences.map(({start}) => {
        start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)

        return {
          date: start.format('ddd Do MMM'),
          time: start.format('LT')
        }
      })
    }

    modal.find('.modal-title').text(title)
    modal.find('.modal-body').html(eventDetailsForEdit.render({city: {slug: citySlug}, event}))
    modal.modal({backdrop: 'static'})
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

Object.assign(exports, {render, initialize})
