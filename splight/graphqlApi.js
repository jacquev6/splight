'use strict'

const graphql = require('graphql')
const Hashids = require('hashids')
const Joi = require('joi')
const moment = require('moment')

const schemaString = require('./graphqlApi.gqls')

const schema = graphql.buildSchema(schemaString)

const hashids = new Hashids('', 10)

function makeRoot ({load, save}) {
  const data = Promise.resolve(load()) // @todo Reload data on each request?

  function forward (name) {
    return async function () {
      const ret = makeSyncRoot(await data)[name].apply(undefined, arguments)
      await save(await data)
      return ret
    }
  }

  const ret = {}

  for (var name of ['artists', 'putArtist', 'cities', 'city', 'putLocation', 'putEvent']) {
    ret[name] = forward(name)
  }

  return ret
}

function makeSyncRoot (data) {
  fixData(data)

  var [artists_, getArtist] = slugify(data.artists, 'artist')

  function artists () {
    return artists_
  }

  function putArtist ({artist: {slug, name}}) {
    data.artists[slug] = {name}
    ;[artists_, getArtist] = slugify(data.artists, 'artist')
    return {slug, name}
  }

  const [cities_, getCity] = slugify(data.cities, 'city')

  function cities () {
    return cities_.map(city_)
  }

  function city ({slug}) {
    return city_(getCity(slug))
  }

  function putLocation ({location: {citySlug, slug, name}}) {
    getCity(citySlug).locations[slug] = {name}
    return {slug, name}
  }

  function putEvent ({event: {citySlug, eventId, title, artist, location, tags, occurrences}}) {
    const dataEvent = Object.assign(
      {
        location,
        tags: tags.map(tag => tag),
        occurrences: occurrences.map(({start}) => ({start}))
      },
      artist ? {artist} : {},
      title ? {title} : {}
    )
    const city = getCity(citySlug)
    const [tags_, getTag] = slugify(city.tags, 'tag') // eslint-disable-line
    const [locations, getLocation] = slugify(city.locations, 'location') // eslint-disable-line
    const ret = Object.assign(
      {
        title,
        location: getLocation(location),
        tags: tags.map(getTag),
        occurrences
      },
      artist ? {artist: getArtist(artist)} : {}
    )
    if (eventId) {
      dataEvent.id = ret.id = eventId
      var found = false
      for (var i = 0; i !== city.events.length; ++i) {
        if (city.events[i].id === eventId) {
          found = true
          city.events[i] = dataEvent
        }
      }
      if (!found) {
        throw new Error('No event with id "' + eventId + '"')
      }
    } else {
      ret.id = dataEvent.id = nextEventId(data)
      city.events.push(dataEvent)
    }
    return ret
  }

  function city_ (city) {
    const [tags, getTag] = slugify(city.tags, 'tag')
    const [locations, getLocation] = slugify(city.locations, 'location')

    function firstDate () {
      const d = reduceOccurrencesStarts((a, b) => a < b ? a : b)
      return d && moment(d, moment.HTML5_FMT.DATETIME_LOCAL, true).format(moment.HTML5_FMT.DATE)
    }

    function dateAfter () {
      const d = reduceOccurrencesStarts((a, b) => a < b ? b : a)
      return d && moment(d, moment.HTML5_FMT.DATETIME_LOCAL, true).add(1, 'day').format(moment.HTML5_FMT.DATE)
    }

    function reduceOccurrencesStarts (f) {
      if (city.events.length) {
        var ret = city.events[0].occurrences[0].start
        city.events.forEach(event => {
          event.occurrences.forEach(occurrence => {
            ret = f(ret, occurrence.start)
          })
        })
        return ret
      } else {
        return null
      }
    }

    function selectEvents (select) {
      return city.events
        .filter(select)
        .map(({id, title, artist, location, tags, occurrences}) => (Object.assign(
          {
            id,
            title,
            location: getLocation(location),
            tags: tags.map(getTag),
            occurrences
          },
          artist ? {artist: getArtist(artist)} : {}
        )))
    }

    function events ({location, artist, dates}) {
      function selectOccurrence ({start, after}) {
        return function (occurrence) {
          if (start && occurrence.start < start) {
            return false
          }
          if (after && occurrence.start >= after) {
            return false
          }
          return true
        }
      }

      function select (event) {
        if (location && event.location !== location) {
          return false
        }
        if (artist && event.artist !== artist) {
          return false
        }
        if (dates && !event.occurrences.some(selectOccurrence(dates))) {
          return false
        }
        return true
      }

      return selectEvents(select)
    }

    function event ({id}) {
      const events = selectEvents(event => event.id === id)
      if (events.length) {
        return events[0]
      } else {
        throw new Error('No event with id "' + id + '"')
      }
    }

    const {slug, name} = city

    return {slug, name, tags, locations, firstDate, dateAfter, events, event}
  }

  return {artists, putArtist, cities, city, putLocation, putEvent}
}

function fixData (data) {
  data._ = data._ || {}
  data._.sequences = data._.sequences || {}
  data._.sequences.events = data._.sequences.events || 0

  Joi.attempt(data, dataSchema)

  const getArtist = slugify(data.artists, 'artist')[1]

  Object.values(data.cities).forEach(city => {
    city.events.forEach(event => {
      if (!event.id) {
        event.id = nextEventId(data)
      }
      if (event.artist) {
        getArtist(event.artist)
      }
    })
  })
}

function nextEventId (data) {
  const id = hashids.encode(data._.sequences.events)
  data._.sequences.events++
  return id
}

function makeSlugSchema () {
  return Joi.string().min(1)
}

const dataSchema = Joi.object({
  _: Joi.object().required().keys({
    sequences: Joi.object().required().keys({
      events: Joi.number().integer().required()
    })
  }),
  artists: Joi.object().required().pattern(makeSlugSchema(), Joi.object({
    name: Joi.string().required()
  })),
  cities: Joi.object().required().pattern(makeSlugSchema(), Joi.object({
    name: Joi.string().required(),
    locations: Joi.object().required().pattern(makeSlugSchema(), Joi.object({
      name: Joi.string().required()
    })),
    tags: Joi.object().required().pattern(makeSlugSchema(), Joi.object({
      title: Joi.string().required()
    })),
    events: Joi.array().required().items(Joi.object({
      id: makeSlugSchema(),
      artist: makeSlugSchema(),
      title: Joi.string(),
      location: makeSlugSchema().required(),
      tags: Joi.array().required().min(1).items(makeSlugSchema()),
      occurrences: Joi.array().required().min(1).items(Joi.object({
        start: Joi.string().required()
      }))
    }))
  }))
})

function slugify (thingsBySlug, name) {
  return [
    Object.entries(thingsBySlug).map(([slug, thing]) => Object.assign({slug}, thing)),
    function (slug) {
      const thing = thingsBySlug[slug]
      if (thing) {
        return Object.assign({slug}, thing)
      } else {
        throw new Error('No ' + name + ' with slug "' + slug + '"')
      }
    }
  ]
}

function make (config) {
  const rootValue = makeRoot(config)

  async function request ({requestString, variableValues}) {
    const response = await graphql.graphql(schema, requestString, rootValue, undefined, variableValues)

    // if (response.errors) {
    //   console.log('GraphQL requestString:', requestString)
    //   console.log('GraphQL variableValues:', variableValues)
    //   console.log('GraphQL errors:', response.errors)
    // }

    return response
  }

  return {schema, rootValue, request}
}

Object.assign(exports, {make, forTest: {makeRoot: makeSyncRoot, schema}})
