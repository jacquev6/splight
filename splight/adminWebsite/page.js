'use strict'

const jQuery = require('jquery')
// const moment = require('moment')
const mustache = require('mustache')

const eventDetails_ = require('../publicWebsite/widgets/eventDetails')
const eventsTemplate = require('./widgets/events.html')
const template = require('./page.html')
const utils = require('./utils')
const what = require('../publicWebsite/widgets/eventDetails/what')
const when = require('../publicWebsite/widgets/eventDetails/when')
const where = require('../publicWebsite/widgets/eventDetails/where')

const {fillSelect, request} = utils

const eventDetailsForDisplay = eventDetails_.make({when, what, where})

function render ({scripts}) {
  return mustache.render(template, {scripts})
}

async function initialize () {
  const eventEditor = (function () {
    var active
    const modal = jQuery('#spa-modify-event-modal')

    modal.modal({backdrop: 'static', show: false})
    modal.on('hide.bs.modal', deactivate)
    jQuery('#spa-modify-event-save').on('click', save)

    deactivate

    return {activate}

    async function activate ({citySlug, eventId}) {
      console.log('eventEditor.activate', {citySlug, eventId})

      const {city: {event}} = await request({
        requestString: 'query($citySlug:ID!, $eventId:ID!){city(slug:$citySlug){event(id:$eventId){id title location{slug name} tags{slug title} artist{slug name} occurrences{start}}}}',
        variableValues: {citySlug, eventId}
      })
      active = {citySlug, event}

      modal.find('.modal-title').text(event.title)
      modal.find('.modal-body').html(eventDetailsForDisplay.render({city: {slug: citySlug}, event}))

      modal.modal('show')
    }

    async function save () {
      console.log('eventEditor.save', active)

      const event = {
        citySlug: active.citySlug,
        eventId: active.event.id,
        title: active.event.title,
        artist: active.event.artist && active.event.artist.slug,
        location: active.event.location.slug,
        tags: active.event.tags.map(({slug}) => slug),
        occurrences: active.event.occurrences
      }

      modal.modal('hide')

      await request({
        requestString: 'mutation($event:IEvent!){putEvent(event:$event){id}}',
        variableValues: {event}
      })
    }

    function deactivate () {
      active = null
      console.log('eventEditor.deactivate')
    }
  }())

  const eventsFilter = (function () {
    var active
    const filter = jQuery('#spa-events-filter')
    const filteredEvents = jQuery('#spa-filtered-events')
    const filterLocation = jQuery('#spa-filter-location')
    const filterArtist = jQuery('#spa-filter-artist')
    const filterTitle = jQuery('#spa-filter-title')

    filterLocation.on('change', handleFilterChange)
    filterArtist.on('change', handleFilterChange)
    var filterTitleTimeoutId = null
    filterTitle.on('input', () => {
      clearTimeout(filterTitleTimeoutId)
      filterTitleTimeoutId = setTimeout(handleFilterChange, 200)
    })

    jQuery(document).on('click', '.spa-modify-event', function () {
      const eventId = jQuery(this).data('spa-event-id')
      eventEditor.activate({citySlug: active.citySlug, eventId})
    })

    deactivate()

    return {activate, deactivate}

    async function activate ({citySlug}) {
      deactivate()
      active = {citySlug}

      const data = await request({
        requestString: 'query($citySlug:ID!){artists{slug name} city(slug:$citySlug){locations{slug name}}}',
        variableValues: {citySlug}
      })

      // Maybe use a https://jqueryui.com/autocomplete/#combobox for these selects
      fillSelect(filterLocation, data.city.locations.map(({slug, name}) => ({value: slug, display: name})))
      fillSelect(filterArtist, data.artists.map(({slug, name}) => ({value: slug, display: name})))
      filterTitle.val('')

      displayDisclaimer()

      filter.show()
      filteredEvents.show()
    }

    function deactivate () {
      active = null
      filter.hide()
      filteredEvents.hide()
    }

    async function handleFilterChange () {
      const location = filterLocation.val()
      const artist = filterArtist.val()
      const title = filterTitle.val()

      const filter = {
        location: location === '-' ? undefined : location,
        artist: artist === '-' ? undefined : artist,
        title: title === '' ? undefined : title
      }

      if (Object.values(filter).some(x => x)) {
        const {city: {events}} = await request({
          requestString: 'query($citySlug:ID!,$location:ID,$artist:ID,$title:String){city(slug:$citySlug){events(location:$location,artist:$artist,title:$title){id title artist{name} location{name} occurrences{start} tags{slug title}}}}',
          variableValues: Object.assign({citySlug: active.citySlug}, filter)
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
      filteredEvents.html(mustache.render(
        eventsTemplate,
        {
          events: events.map(({id, title, tags, artist, location, occurrences}) => {
            const event = {id, title, location, tags, artist, occurrences}

            event.details = {html: eventDetailsForDisplay.render({city: {slug: active.citySlug}, event})}

            return event
          })
        }
      ))
    }

    function displayNoMatchingEvents () {
      filteredEvents.html('<p>Aucun événement ne correspond.</p>')
    }

    function displayDisclaimer () {
      filteredEvents.html('<p>Utiliser le filtre sur la gauche pour afficher les événements qui correspondent.</p>')
    }
  }())

  const selectCity = jQuery('#spa-select-city')

  fillSelect(
    selectCity,
    (await request({requestString: '{cities{slug name}}'})).cities.map(({slug, name}) => ({
      value: slug,
      display: name
    }))
  )

  selectCity.on('change', () => {
    const citySlug = selectCity.val()
    if (citySlug === '-') {
      eventsFilter.deactivate()
    } else {
      eventsFilter.activate({citySlug})
    }
  })
}

Object.assign(exports, {render, initialize})
