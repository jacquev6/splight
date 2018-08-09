'use strict'

const jQuery = require('jquery')
const moment = require('moment')
const mustache = require('mustache')

const eventDetails_ = require('../publicWebsite/widgets/eventDetails')
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
  const isDebug = window.location.href.indexOf('?debug') !== -1

  const eventEditor = (function () {
    var active
    const modal = jQuery('#spa-edit-item-modal')

    modal.modal({backdrop: 'static', keyboard: false, show: false})
    modal.on('hide.bs.modal', deactivate)
    jQuery('#spa-edit-item-save').on('click', save)

    doc.on('click', '#spa-edit-event-edit-preview-when', function () {
      active.editingWhen = !active.editingWhen
      active.editingWhat = false
      active.editingWhere = false
      refreshContent()
    })
    doc.on('click', '.spa-delete-occurrence', function () {
      const index = jQuery('.spa-delete-occurrence').index(this)
      active.event.occurrences.splice(index, 1)
      refreshContent()
    })
    doc.on('input', '#spa-new-occurrence', function () {
      active.newOccurrence = jQuery('#spa-new-occurrence').val()
      const m = moment(active.newOccurrence, moment.HTML5_FMT.DATETIME_LOCAL, true)
      jQuery('#spa-add-occurrence').attr('disabled', !m.isValid())
    })
    doc.on('click', '#spa-add-occurrence', function () {
      active.event.occurrences.push({start: active.newOccurrence})
      active.newOccurrence = null
      refreshContent()
    })

    doc.on('click', '#spa-edit-event-edit-preview-what', function () {
      active.editingWhen = false
      active.editingWhat = !active.editingWhat
      active.editingWhere = false
      refreshContent()
    })
    doc.on('change', '#spa-edit-event-main-tag', function () {
      const previousMainTag = active.event.tags.length > 0 && active.event.tags[0].slug
      const previousSecondaryTags = new Set(active.event.tags.slice(1).map(({slug}) => slug))

      const newMainTag = jQuery('#spa-edit-event-main-tag').val()
      const newSecondaryTags = new Set(previousSecondaryTags)

      if (previousSecondaryTags.has(newMainTag)) {
        newSecondaryTags.delete(newMainTag)
        newSecondaryTags.add(previousMainTag)
      }

      const tags = [newMainTag].concat(Array.from(newSecondaryTags))
      active.event.tags = tags.map(slug => active.tagsBySlug[slug])
      refreshContent()
    })
    doc.on('change', '.spa-edit-event-secondary-tag', function () {
      const mainTag = jQuery('#spa-edit-event-main-tag').val()
      const secondaryTags = jQuery('.spa-edit-event-secondary-tag:checked').map((index, checkbox) => jQuery(checkbox).val()).toArray()
      const tags = [mainTag].concat(secondaryTags)
      active.event.tags = tags.map(slug => active.tagsBySlug[slug])
      refreshContent()
    })
    doc.on('input', '#spa-edit-event-title', function () {
      active.event.title = jQuery('#spa-edit-event-title').val()
      refreshHeaderAndFooter()
    })
    doc.on('change', '#spa-edit-event-artist', function () {
      active.event.artist = active.artistsBySlug[jQuery('#spa-edit-event-artist').val()]
      refreshHeaderAndFooter()
    })
    doc.on('click', '#spa-edit-event-new-artist', function () {
      if (!active.newArtist) {
        active.cachedExistingArtist = active.event.artist
        active.event.artist = active.newArtist = active.cachedNewArtist
        refreshContent()
      }
    })
    doc.on('click', '#spa-edit-event-choose-artist', function () {
      if (active.newArtist) {
        active.newArtist = null
        active.event.artist = active.cachedExistingArtist
        refreshContent()
      }
    })
    doc.on('input', '#spa-edit-event-new-artist-slug', function () {
      active.newArtist.slug = jQuery('#spa-edit-event-new-artist-slug').val()
      refreshHeaderAndFooter()
    })
    doc.on('input', '#spa-edit-event-new-artist-name', function () {
      active.newArtist.name = jQuery('#spa-edit-event-new-artist-name').val()
      refreshHeaderAndFooter()
    })

    doc.on('click', '#spa-edit-event-edit-preview-where', function () {
      active.editingWhen = false
      active.editingWhat = false
      active.editingWhere = !active.editingWhere
      refreshContent()
    })
    doc.on('change', '#spa-edit-event-location', function () {
      active.event.location = active.locationsBySlug[jQuery('#spa-edit-event-location').val()]
      refreshHeaderAndFooter()
    })
    doc.on('click', '#spa-edit-event-new-location', function () {
      if (!active.newLocation) {
        active.cachedExistingLocation = active.event.location
        active.event.location = active.newLocation = active.cachedNewLocation
        refreshContent()
      }
    })
    doc.on('click', '#spa-edit-event-choose-location', function () {
      if (active.newLocation) {
        active.newLocation = null
        active.event.location = active.cachedExistingLocation
        refreshContent()
      }
    })
    doc.on('input', '#spa-edit-event-new-location-slug', function () {
      active.newLocation.slug = jQuery('#spa-edit-event-new-location-slug').val()
      refreshHeaderAndFooter()
    })
    doc.on('input', '#spa-edit-event-new-location-name', function () {
      active.newLocation.name = jQuery('#spa-edit-event-new-location-name').val()
      refreshHeaderAndFooter()
    })

    const eventDetailsForEdit = (function () {
      const whenForEdit = (function () {
        const template = `<ul>
          {{#occurrences}}<li>{{start}} <button class="btn btn-secondary btn-sm spa-delete-occurrence">Supprimer</button></li>{{/occurrences}}
          <li><input id="spa-new-occurrence" type="text" placeholder="Format&nbsp;: 2018-07-14T12:00"{{#newOccurrence}} value="{{.}}"{{/newOccurrence}}/> <button id="spa-add-occurrence" class="btn btn-secondary btn-sm"{{#addDisabled}} disabled="disabled"{{/addDisabled}}>Ajouter</button></li>
        </ul>`

        function render ({event: {occurrences}}) {
          return mustache.render(template, {
            newOccurrence: active.newOccurrence,
            addDisabled: !moment(active.newOccurrence, moment.HTML5_FMT.DATETIME_LOCAL, true).isValid(),
            occurrences
          })
        }

        return {render}
      }())

      const whatForEdit = (function () {
        const template = `
          <div class="form-group"><label>Catégorie principale&nbsp;: <select id="spa-edit-event-main-tag">
            {{#untagged}}<option disabled="disabled" selected="selected">-</option>{{/untagged}}
            {{#tags}}<option value="{{slug}}"{{#isMain}} selected="selected"{{/isMain}}>{{title}}</option>{{/tags}}
          </select></label></div>
          <p>Catégories secondaires&nbsp;:</p>
          <ul>{{#tags}}{{^isMain}}<li><label>{{title}} <input class="spa-edit-event-secondary-tag" type="checkbox" value="{{slug}}"{{#isSecondary}} checked="checked"{{/isSecondary}} /></label></li>{{/isMain}}{{/tags}}</ul>
          <div class="form-group"><label>Titre&nbsp;: <input id="spa-edit-event-title" value="{{title}}" /></label></div>
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a id="spa-edit-event-choose-artist" class="nav-link{{^newArtist}} active{{/newArtist}}" data-toggle="tab" href="#spa-edit-event-artist-tab-existing">Artiste existant</a>
            </li>
            <li class="nav-item">
              <a id="spa-edit-event-new-artist" class="nav-link{{#newArtist}} active{{/newArtist}}" data-toggle="tab" href="#spa-edit-event-artist-tab-new">Nouvel artiste</a>
            </li>
          </ul>
          <div class="tab-content border border-top-0 pt-2 px-2" id="spa-edit-event-artist-tabs">
            <div class="tab-pane{{^newArtist}} show active{{/newArtist}}" id="spa-edit-event-artist-tab-existing">
              <div class="form-group"><label>Choisir un artiste&nbsp;: <select id="spa-edit-event-artist"><option value="-">-</option>{{#artists}}<option value="{{slug}}"{{#selected}} selected="selected"{{/selected}}>{{name}}</option>{{/artists}}</select></label></div>
            </div>
            <div class="tab-pane{{#newArtist}} show active{{/newArtist}}" id="spa-edit-event-artist-tab-new">
              <div class="form-group"><label>Slug&nbsp;: <input id="spa-edit-event-new-artist-slug" value="{{newArtist.slug}}"/></label></div>
              <div class="form-group"><label>Nom&nbsp;: <input id="spa-edit-event-new-artist-name" value="{{newArtist.name}}"/></label></div>
            </div>
          </div>
        `

        function render ({event: {tags: eventTags, artist, title}}) {
          const artists = active.artists.map(({slug, name}) => (
            {slug, name, selected: artist && slug === artist.slug}
          ))

          const untagged = eventTags.length === 0
          const mainTag = !untagged && eventTags[0].slug
          const secondaryTags = new Set(eventTags.slice(1).map(({slug}) => slug))

          const tags = active.tags.map(({slug, title}) => (
            {slug, title, isMain: slug === mainTag, isSecondary: secondaryTags.has(slug)}
          ))

          return mustache.render(template, {untagged, tags, title, artists, newArtist: active.newArtist})
        }

        return {render}
      }())

      const whereForEdit = (function () {
        const template = `
          <ul class="nav nav-tabs">
            <li class="nav-item">
              <a id="spa-edit-event-choose-location" class="nav-link{{^newLocation}} active{{/newLocation}}" data-toggle="tab" href="#spa-edit-event-location-tab-existing">Lieu existant</a>
            </li>
            <li class="nav-item">
              <a id="spa-edit-event-new-location" class="nav-link{{#newLocation}} active{{/newLocation}}" data-toggle="tab" href="#spa-edit-event-location-tab-new">Nouveau lieu</a>
            </li>
          </ul>
          <div class="tab-content border border-top-0 pt-2 px-2" id="spa-edit-event-location-tabs">
            <div class="tab-pane{{^newLocation}} show active{{/newLocation}}" id="spa-edit-event-location-tab-existing">
              <div class="form-group"><label>Choisir un lieu&nbsp;: <select id="spa-edit-event-location">
                {{#unlocated}}<option disabled="disabled" selected="selected">-</option>{{/unlocated}}
                {{#locations}}<option value="{{slug}}"{{#selected}} selected="selected"{{/selected}}>{{name}}</option>{{/locations}}
              </select></label></div>
            </div>
            <div class="tab-pane{{#newLocation}} show active{{/newLocation}}" id="spa-edit-event-location-tab-new">
              <div class="form-group"><label>Slug&nbsp;: <input id="spa-edit-event-new-location-slug" value="{{newLocation.slug}}"/></label></div>
              <div class="form-group"><label>Nom&nbsp;: <input id="spa-edit-event-new-location-name" value="{{newLocation.name}}"/></label></div>
            </div>
          </div>
        `

        function render ({event: {location}}) {
          const unlocated = !location

          const locations = active.locations.map(({slug, name}) => (
            {slug, name, selected: slug === (location && location.slug)}
          ))

          return mustache.render(template, {unlocated, locations, newLocation: active.newLocation})
        }

        return {render}
      }())

      function forEditPreview ({isEditing, idSuffix, forEdit, forDisplay}) {
        function render (data) {
          if (isEditing()) {
            return forEdit.render(data)
          } else {
            return forDisplay.render(data)
          }
        }

        const postTitleTemplate = ' <button id="spa-edit-event-edit-preview-{{idSuffix}}" class="btn btn-secondary btn-sm">{{display}}</button>'

        function renderPostTitle () {
          return mustache.render(
            postTitleTemplate,
            {
              idSuffix,
              display: isEditing() ? 'Prévisualiser' : 'Modifier'
            }
          )
        }

        return {render, renderPostTitle}
      }

      return eventDetails_.make({
        when: forEditPreview({
          isEditing: () => active.editingWhen,
          idSuffix: 'when',
          forEdit: whenForEdit,
          forDisplay: whenForDisplay
        }),
        what: forEditPreview({
          isEditing: () => active.editingWhat,
          idSuffix: 'what',
          forEdit: whatForEdit,
          forDisplay: whatForDisplay
        }),
        where: forEditPreview({
          isEditing: () => active.editingWhere,
          idSuffix: 'where',
          forEdit: whereForEdit,
          forDisplay: whereForDisplay
        })
      })
    }())

    deactivate()

    return {create, modify}

    async function create ({citySlug}) {
      // @todo Initialize event with values from filter
      const event = {
        title: null,
        location: null,
        tags: [],
        artist: null,
        occurrences: []
      }
      await activate({citySlug, event})
    }

    async function modify ({citySlug, eventId}) {
      const {city: {event}} = await request({
        requestString: 'query($citySlug:ID!, $eventId:ID!){city(slug:$citySlug){event(id:$eventId){id title location{slug name} tags{slug title} artist{slug name} occurrences{start}}}}',
        variableValues: {citySlug, eventId}
      })
      await activate({citySlug, event})
    }

    async function activate ({citySlug, event}) {
      const {artists, city: {locations, tags}} = await request({
        requestString: 'query($citySlug:ID!){artists{slug name} city(slug:$citySlug){locations{slug name} tags{slug title}}}',
        variableValues: {citySlug}
      })

      const artistsBySlug = {}
      artists.forEach(artist => { artistsBySlug[artist.slug] = artist })

      const locationsBySlug = {}
      locations.forEach(location => { locationsBySlug[location.slug] = location })

      const tagsBySlug = {}
      tags.forEach(tag => { tagsBySlug[tag.slug] = tag })

      active = {
        citySlug,
        artists,
        artistsBySlug,
        locations,
        locationsBySlug,
        tags,
        tagsBySlug,
        event,
        editingWhen: false,
        editingWhat: false,
        editingWhere: false,
        newLocation: null,
        cachedNewLocation: {slug: '', name: ''},
        newArtist: null,
        cachedNewArtist: {slug: '', name: ''},
        newOccurrence: null
      }

      refreshContent()
      modal.modal('show')
    }

    function refreshContent ({body} = {body: true}) {
      const focusedId = document.activeElement.id
      modal.find('.modal-body').html(eventDetailsForEdit.render({city: {slug: active.citySlug}, event: active.event}))
      if (focusedId) {
        modal.find('#' + focusedId).focus()
      }
      refreshHeaderAndFooter()
    }

    function refreshHeaderAndFooter () {
      modal.find('.modal-title').text(active.event.title)
      const message = validateEvent()
      modal.find('#spa-edit-item-message').text(message)
      jQuery('#spa-edit-item-save').attr('disabled', message !== '')
      modal.modal('handleUpdate')
    }

    function validateEvent () {
      if (active.event.occurrences.length === 0) {
        return 'Il faut au moins une représentation'
      } else if (active.event.tags.length === 0) {
        return 'Choisir une catégorie principale'
      } else if (!active.event.title && !active.event.artist) {
        return 'Il faut un titre ou un artiste'
      } else if (active.newArtist && !active.newArtist.slug.match(/^[a-z][-a-z0-9]*$/)) {
        return "Le slug d'un nouvel artiste doit être constitué d'un caractère parmi 'a-z' suivi de caractères parmi 'a-z', '0-9' et '-'"
      } else if (active.newArtist && active.artistsBySlug[active.newArtist.slug]) {
        return "Le slug d'un nouvel artiste doit être différent de tous les slugs des artistes existants"
      } else if (active.newArtist && !active.newArtist.name) {
        return "Le nom d'un nouvel artiste ne peut pas être vide"
      } else if (!active.event.location) {
        return 'Choisir un lieu'
      } else if (active.newLocation && !active.newLocation.slug.match(/^[a-z][-a-z0-9]*$/)) {
        return "Le slug d'un nouveau lieu doit être constitué d'un caractère parmi 'a-z' suivi de caractères parmi 'a-z', '0-9' et '-'"
      } else if (active.newLocation && active.locationsBySlug[active.newLocation.slug]) {
        return "Le slug d'un nouveau lieu doit être différent de tous les slugs des lieux existants"
      } else if (active.newLocation && !active.newLocation.name) {
        return "Le nom d'un nouveau lieu ne peut pas être vide"
      } else {
        return ''
      }
    }

    async function save () {
      const hasArtist = !!active.newArtist

      const artist = active.newArtist || {slug: '', name: ''}

      const hasLocation = !!active.newLocation

      const location = active.newLocation || {slug: '', name: ''}
      location.citySlug = active.citySlug

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
        requestString: `mutation($hasArtist:Boolean!,$artist:IArtist!,$hasLocation:Boolean!,$location:ILocation!,$event:IEvent!){
          putArtist(artist:$artist)@include(if:$hasArtist){slug}
          putLocation(location:$location)@include(if:$hasLocation){slug}
          putEvent(event:$event){id}
        }`,
        variableValues: {hasArtist, artist, hasLocation, location, event}
      })

      modal.modal('hide')

      // eventsFilter.refreshContent()
    }

    function deactivate () {
      active = null
    }
  }())

  const eventsFilter = (function () {
    var active = null
    const filteredEvents = jQuery('#spa-filtered-items')
    const filterTag = jQuery('#spa-filter-event-tag')
    const filterLocation = jQuery('#spa-filter-event-location')
    const filterArtist = jQuery('#spa-filter-event-artist')
    const filterDate = jQuery('#spa-filter-event-date')
    const filterTitle = jQuery('#spa-filter-event-title')

    filterTag.on('change', refreshContent)
    filterLocation.on('change', refreshContent)
    filterArtist.on('change', refreshContent)
    var filterTitleTimeoutId = null
    filterTitle.on('input', () => {
      clearTimeout(filterTitleTimeoutId)
      filterTitleTimeoutId = setTimeout(refreshContent, 200)
    })
    var filterDateTimeoutId = null
    filterDate.on('input', () => {
      clearTimeout(filterDateTimeoutId)
      filterDateTimeoutId = setTimeout(refreshContent, 200)
    })

    doc.on('click', '#spa-create-event', function () {
      eventEditor.create({
        citySlug: active.citySlug
      })
    })
    doc.on('click', '.spa-modify-event', function () {
      eventEditor.modify({
        citySlug: active.citySlug,
        eventId: jQuery(this).data('spa-event-id')
      })
    })

    return {activate, refreshContent}

    async function activate ({citySlug}) {
      active = {citySlug}

      const data = await request({
        requestString: 'query($citySlug:ID!){artists{slug name} city(slug:$citySlug){tags{slug title} locations{slug name}}}',
        variableValues: {citySlug}
      })

      // @todo Refill selects when an event is edited, as it may add or modify artists and locations
      // Maybe use a https://jqueryui.com/autocomplete/#combobox for these selects
      fillSelect(filterTag, data.city.tags.map(({slug, title}) => ({value: slug, display: title})))
      fillSelect(filterLocation, data.city.locations.map(({slug, name}) => ({value: slug, display: name})))
      fillSelect(filterArtist, data.artists.map(({slug, name}) => ({value: slug, display: name})))
      filterDate.val('')
      filterTitle.val('')

      refreshContent()
    }

    async function refreshContent () {
      const tag = filterTag.val()
      const location = filterLocation.val()
      const artist = filterArtist.val()
      const date = moment(filterDate.val(), moment.HTML5_FMT.DATE, true)
      const title = filterTitle.val()

      var dates
      if (date.isValid()) {
        dates = {
          start: date.format(moment.HTML5_FMT.DATE),
          after: date.clone().add(1, 'day').format(moment.HTML5_FMT.DATE)
        }
      }

      const {city: {events}} = await request({
        requestString: 'query($citySlug:ID!,$tag:ID,$location:ID,$artist:ID,$title:String,$dates:IDateInterval){city(slug:$citySlug){events(tag:$tag,location:$location,artist:$artist,title:$title,dates:$dates,max:10){id title artist{name} location{name} occurrences{start} tags{slug title}}}}',
        variableValues: {
          citySlug: active.citySlug,
          tag: tag === '-' ? undefined : tag,
          location: location === '-' ? undefined : location,
          artist: artist === '-' ? undefined : artist,
          title: title === '' ? undefined : title,
          dates
        }
      })

      displayEvents(events)
    }

    function displayEvents (events) {
      const template = `
        {{#zero}}<p>Aucun événement ne correspond au filtre.</p>{{/zero}}
        {{#one}}<p>L'événement suivant est le seul correspondant au filtre.</p>{{/one}}
        {{#several}}<p>Les {{events.length}} événements suivants correspondent au filtre.</p>{{/several}}
        {{^tooMany}}<p><button id="spa-create-event" class="btn btn-primary">Nouvel événement</button></p>{{/tooMany}}
        {{#tooMany}}<p>Trop d'événements correspondent. Utiliser le filtre pour raffiner la sélection.</p>{{/tooMany}}
        {{#events}}
        <div class="card m-1">
          <div class="card-header">
            {{title}}
          </div>
          <div class="card-body">
            {{{details.html}}}
          </div>
          <div class="card-footer">
            <button class="btn btn-primary spa-modify-event" data-spa-event-id="{{id}}">Modifier</button>
          </div>
        </div>
        {{/events}}
      `

      var zero, one, several, tooMany
      if (events) {
        tooMany = false

        events = events.map(({id, title, tags, artist, location, occurrences}) => {
          const event = {id, title, location, tags, artist, occurrences}

          event.details = {html: eventDetailsForDisplay.render({city: {slug: active.citySlug}, event})}

          return event
        })

        zero = events.length === 0
        one = events.length === 1
        several = events.length > 1
      } else {
        zero = false
        one = false
        several = false
        tooMany = true
      }

      filteredEvents.html(mustache.render(template, {zero, one, several, tooMany, events}))
    }
  }())

  const artistsFilter = (function () {
    const filteredArtists = jQuery('#spa-filtered-items')
    const filterName = jQuery('#spa-filter-artist-name')

    var filterNameTimeoutId = null
    filterName.on('input', () => {
      clearTimeout(filterNameTimeoutId)
      filterNameTimeoutId = setTimeout(refreshContent, 200)
    })

    return {activate}

    function activate () {
      refreshContent()
    }

    async function refreshContent () {
      const name = filterName.val()

      const {artists} = await request({
        requestString: 'query($name:String){artists(name:$name,max:10){slug name}}',
        variableValues: {name}
      })

      displayArtists(artists)
    }

    function displayArtists (artists) {
      const template = `
        {{#zero}}<p>Aucun artiste ne correspond au filtre.</p>{{/zero}}
        {{#one}}<p>L'artiste suivant est le seul correspondant au filtre.</p>{{/one}}
        {{#several}}<p>Les {{artists.length}} artistes suivants correspondent au filtre.</p>{{/several}}
        {{^tooMany}}<p><button id="spa-create-artist" class="btn btn-primary" disabled>Nouvel artiste</button></p>{{/tooMany}}
        {{#tooMany}}<p>Trop d'artistes correspondent. Utiliser le filtre pour raffiner la sélection.</p>{{/tooMany}}
        {{#artists}}
        <div class="card m-1">
          <div class="card-header">
            {{name}}
          </div>
          <div class="card-body">
            {{{details.html}}}
          </div>
          <div class="card-footer">
            <button class="btn btn-primary spa-modify-artist" disabled data-spa-artist-slug="{{slug}}">Modifier</button>
          </div>
        </div>
        {{/artists}}
      `

      var zero, one, several, tooMany
      if (artists) {
        tooMany = false

        artists = artists.map(({slug, name}) => {
          const artist = {slug, name}

          artist.details = {html: ''}

          return artist
        })

        zero = artists.length === 0
        one = artists.length === 1
        several = artists.length > 1
      } else {
        zero = false
        one = false
        several = false
        tooMany = true
      }

      filteredArtists.html(mustache.render(template, {zero, one, several, tooMany, artists}))
    }
  }())

  const locationsFilter = (function () {
    var active = null
    const filteredLocations = jQuery('#spa-filtered-items')
    const filterName = jQuery('#spa-filter-location-name')

    var filterNameTimeoutId = null
    filterName.on('input', () => {
      clearTimeout(filterNameTimeoutId)
      filterNameTimeoutId = setTimeout(refreshContent, 200)
    })

    return {activate}

    function activate ({citySlug}) {
      active = {citySlug}
      refreshContent()
    }

    async function refreshContent () {
      const name = filterName.val()

      const {city: {locations}} = await request({
        requestString: 'query($citySlug:ID!,$name:String){city(slug:$citySlug){locations(name:$name,max:10){slug name}}}',
        variableValues: {
          citySlug: active.citySlug,
          name
        }
      })

      displayLocations(locations)
    }

    function displayLocations (locations) {
      const template = `
        {{#zero}}<p>Aucun lieu ne correspond au filtre.</p>{{/zero}}
        {{#one}}<p>Le lieu suivant est le seul correspondant au filtre.</p>{{/one}}
        {{#several}}<p>Les {{locations.length}} lieux suivants correspondent au filtre.</p>{{/several}}
        {{^tooMany}}<p><button id="spa-create-location" class="btn btn-primary" disabled>Nouveau lieu</button></p>{{/tooMany}}
        {{#tooMany}}<p>Trop de lieux correspondent. Utiliser le filtre pour raffiner la sélection.</p>{{/tooMany}}
        {{#locations}}
        <div class="card m-1">
          <div class="card-header">
            {{name}}
          </div>
          <div class="card-body">
            {{{details.html}}}
          </div>
          <div class="card-footer">
            <button class="btn btn-primary spa-modify-location" disabled data-spa-location-slug="{{slug}}">Modifier</button>
          </div>
        </div>
        {{/locations}}
      `

      var zero, one, several, tooMany
      if (locations) {
        tooMany = false

        locations = locations.map(({slug, name}) => {
          const location = {slug, name}

          location.details = {html: ''}

          return location
        })

        zero = locations.length === 0
        one = locations.length === 1
        several = locations.length > 1
      } else {
        zero = false
        one = false
        several = false
        tooMany = true
      }

      filteredLocations.html(mustache.render(template, {zero, one, several, tooMany, locations}))
    }
  }())

  const cityEditor = (function () {
    var active = null
    const cityEditor = jQuery('.spa-city-editor')
    const editEvents = jQuery('#spa-edit-events')
    const editArtists = jQuery('#spa-edit-artists')
    const editLocations = jQuery('#spa-edit-locations')

    editEvents.on('click', function () {
      eventsFilter.activate(active)
    })

    editArtists.on('click', function () {
      artistsFilter.activate(active)
    })

    editLocations.on('click', function () {
      locationsFilter.activate(active)
    })

    deactivate()

    return {activate, deactivate}

    function activate ({citySlug}) {
      active = {citySlug}
      cityEditor.show()
      editEvents.tab('show')
      eventsFilter.activate({citySlug})
    }

    function deactivate () {
      active = null
      cityEditor.hide()
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
      cityEditor.deactivate()
    } else {
      cityEditor.activate({citySlug})
    }
  })

  if (isDebug) {
    selectCity.val('avalon').trigger('change')
  }
}

Object.assign(exports, {render, initialize})
