'use strict'

const jQuery = require('jquery')
const moment = require('moment')
const mustache = require('mustache')

const eventDetails_ = require('../publicWebsite/widgets/eventDetails')
const eventsTemplate = require('./widgets/events.html')
const template = require('./page.html')
const utils = require('./utils')
const whatForDisplay = require('../publicWebsite/widgets/eventDetails/what')
const whenForDisplay = require('../publicWebsite/widgets/eventDetails/when')
const whereForDisplay = require('../publicWebsite/widgets/eventDetails/where')

const {fillSelect, request} = utils

const eventDetailsForDisplay = eventDetails_.make({when: whenForDisplay, what: whatForDisplay, where: whereForDisplay})

function render ({scripts}) {
  return mustache.render(template, {scripts})
}

async function initialize () {
  const doc = jQuery(document)

  const eventEditor = (function () {
    var active
    const modal = jQuery('#spa-modify-event-modal')

    modal.modal({backdrop: 'static', show: false})
    modal.on('hide.bs.modal', deactivate)
    jQuery('#spa-modify-event-save').on('click', save)

    doc.on('click', '#spa-edit-event-edit-when, #spa-edit-event-preview-when', function () {
      active.editingWhen = !active.editingWhen
      refreshContent()
    })
    doc.on('click', '.spa-delete-occurrence', function () {
      const index = jQuery('.spa-delete-occurrence').index(this)
      active.event.occurrences.splice(index, 1)
      refreshContent()
    })
    doc.on('input', '#spa-new-occurrence', function () {
      const m = moment(jQuery('#spa-new-occurrence').val(), moment.HTML5_FMT.DATETIME_LOCAL, true)
      jQuery('#spa-add-occurrence').attr('disabled', !m.isValid())
    })
    doc.on('click', '#spa-add-occurrence', function () {
      const start = jQuery('#spa-new-occurrence').val()
      active.event.occurrences.push({start})
      refreshContent()
    })

    doc.on('click', '#spa-edit-event-edit-what, #spa-edit-event-preview-what', function () {
      active.editingWhat = !active.editingWhat
      refreshContent()
    })

    doc.on('click', '#spa-edit-event-edit-where, #spa-edit-event-preview-where', function () {
      active.editingWhere = !active.editingWhere
      refreshContent()
    })

    const eventDetailsForEdit = (function () {
      const whenForEdit = (function () {
        const template = `<ul>
          {{#occurrences}}<li>{{start}} <button class="btn btn-secondary btn-sm spa-delete-occurrence">Supprimer</button></li>{{/occurrences}}
          <li><input id="spa-new-occurrence" type="text" placeholder="2018-07-14T12:00"/> <button id="spa-add-occurrence" class="btn btn-secondary btn-sm" disabled="disabled">Ajouter</button></li>
        </ul>`

        function render ({event: {occurrences}}) {
          return mustache.render(template, {occurrences})
        }

        return {render}
      }())

      // @todo Factorize
      const whenForEditPreview = (function () {
        function render (data) {
          if (active.editingWhen) {
            return whenForEdit.render(data)
          } else {
            return whenForDisplay.render(data)
          }
        }

        function renderPostTitle () {
          if (active.editingWhen) {
            return ' <button id="spa-edit-event-preview-when" class="btn btn-secondary btn-sm">Prévisualiser</button>'
          } else {
            return ' <button id="spa-edit-event-edit-when" class="btn btn-secondary btn-sm">Modifier</button>'
          }
        }

        return {render, renderPostTitle}
      }())

      const whatForEditPreview = (function () {
        function render (data) {
          if (active.editingWhat) {
            return whatForDisplay.render(data)
          } else {
            return whatForDisplay.render(data)
          }
        }

        function renderPostTitle () {
          if (active.editingWhat) {
            return ' <button id="spa-edit-event-preview-what" class="btn btn-secondary btn-sm">Prévisualiser</button>'
          } else {
            return ' <button id="spa-edit-event-edit-what" class="btn btn-secondary btn-sm">Modifier</button>'
          }
        }

        return {render, renderPostTitle}
      }())

      const whereForEditPreview = (function () {
        function render (data) {
          if (active.editingWhere) {
            return whereForDisplay.render(data)
          } else {
            return whereForDisplay.render(data)
          }
        }

        function renderPostTitle () {
          if (active.editingWhere) {
            return ' <button id="spa-edit-event-preview-where" class="btn btn-secondary btn-sm">Prévisualiser</button>'
          } else {
            return ' <button id="spa-edit-event-edit-where" class="btn btn-secondary btn-sm">Modifier</button>'
          }
        }

        return {render, renderPostTitle}
      }())

      return eventDetails_.make({when: whenForEditPreview, what: whatForEditPreview, where: whereForEditPreview})
    }())

    deactivate()

    return {activate}

    async function activate ({citySlug, eventId}) {
      const {city: {event}} = await request({
        requestString: 'query($citySlug:ID!, $eventId:ID!){city(slug:$citySlug){event(id:$eventId){id title location{slug name} tags{slug title} artist{slug name} occurrences{start}}}}',
        variableValues: {citySlug, eventId}
      })
      active = {
        citySlug,
        event,
        editingWhen: false,
        editingWhat: false,
        editingWhere: false
      }

      refreshContent()
      modal.modal('show')
    }

    function refreshContent () {
      modal.find('.modal-title').text(active.event.title)
      modal.find('.modal-body').html(eventDetailsForEdit.render({city: {slug: active.citySlug}, event: active.event}))
    }

    async function save () {
      const event = {
        citySlug: active.citySlug,
        eventId: active.event.id,
        title: active.event.title,
        artist: active.event.artist && active.event.artist.slug,
        location: active.event.location.slug,
        tags: active.event.tags.map(({slug}) => slug),
        occurrences: active.event.occurrences
      }

      await request({
        requestString: 'mutation($event:IEvent!){putEvent(event:$event){id}}',
        variableValues: {event}
      })

      modal.modal('hide')

      eventsFilter.refreshContent()
    }

    function deactivate () {
      active = null
    }
  }())

  const eventsFilter = (function () {
    var active
    const filter = jQuery('#spa-events-filter')
    const filteredEvents = jQuery('#spa-filtered-events')
    const filterLocation = jQuery('#spa-filter-location')
    const filterArtist = jQuery('#spa-filter-artist')
    const filterTitle = jQuery('#spa-filter-title')

    filterLocation.on('change', refreshContent)
    filterArtist.on('change', refreshContent)
    var filterTitleTimeoutId = null
    filterTitle.on('input', () => {
      clearTimeout(filterTitleTimeoutId)
      filterTitleTimeoutId = setTimeout(refreshContent, 200)
    })

    doc.on('click', '.spa-modify-event', function () {
      const eventId = jQuery(this).data('spa-event-id')
      eventEditor.activate({citySlug: active.citySlug, eventId})
    })

    deactivate()

    return {activate, deactivate, refreshContent}

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

    async function refreshContent () {
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
