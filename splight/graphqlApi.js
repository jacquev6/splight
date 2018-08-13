'use strict'

const fs = require('fs-extra')
const graphql = require('graphql')
const Hashids = require('hashids')
const Joi = require('joi')
const neatJSON = require('neatjson')
const path = require('path')

const datetime = require('./datetime')
const durations = require('./publicWebsite/durations')
const schemaString = require('./graphqlApi.gqls')

const schema = graphql.buildSchema(schemaString)

const hashids = new Hashids('', 10)

function makeRoot ({dataDirectory, generationDate}) {
  const fileName = path.join(dataDirectory, 'data.json')

  const data = fs.readJSONSync(fileName)

  const root = makeSyncRoot(data, generationDate)

  function forward (name) {
    return function () {
      const ret = root[name].apply(undefined, arguments)
      fs.outputFileSync(fileName, neatJSON.neatJSON(data, {sort: true, wrap: 120, afterColon: 1, afterComma: 1}) + '\n')
      return ret
    }
  }

  const fields = ['generation', 'artists', 'artist', 'putArtist', 'cities', 'city', 'putLocation', 'putEvent', 'deleteEvent']

  const ret = {}

  for (var name of fields) {
    ret[name] = forward(name)
  }

  return ret
}

function makeSyncRoot (data, generationDate) {
  data = encapsulateData(data)
  generationDate = generationDate || datetime.now()

  function generation () {
    return {
      date: generationDate.format(datetime.HTML5_FMT.DATE),
      dateAfter: durations.oneWeek.clip(generationDate).add(5, 'weeks').format(datetime.HTML5_FMT.DATE)
    }
  }

  function artists ({name, max}) {
    const nameMatches = matches(name)
    return data.artists.filter(artist => nameMatches(artist.name), max)
  }

  function artist ({slug}) {
    return data.artists.get(slug)
  }

  function putArtist ({artist}) {
    return data.artists.put(artist)
  }

  function cities () {
    return data.cities.all().map(makeCity)
  }

  function city ({slug}) {
    return makeCity(data.cities.get(slug))
  }

  // @todo Put citySlug as a first argument, independent from ILocation
  function putLocation ({location}) {
    const citySlug = location.citySlug
    delete location.citySlug
    return data.cities.get(citySlug).locations.put(location)
  }

  // @todo Put citySlug as a first argument, independent from IEvent
  function putEvent ({event: {citySlug, eventId, title, artist, location, tags, occurrences}}) {
    return makeEvent(data.cities.get(citySlug).events.put(Object.assign(
      {
        id: eventId,
        location,
        tags: tags.map(tag => tag),
        occurrences: occurrences.map(({start}) => ({start}))
      },
      artist ? {artist} : {},
      title ? {title} : {}
    )))
  }

  function deleteEvent ({citySlug, eventId}) {
    return makeEvent(data.cities.get(citySlug).events.del(eventId))
  }

  function makeEvent ({id, title, location, tags, occurrences, artist}) {
    return {
      id,
      title,
      location: location.resolve(),
      tags: tags.resolve(),
      occurrences,
      artist: artist.resolve()
    }
  }

  function makeCity (city) {
    function tags () {
      return city.tags.all()
    }

    function locations ({name, max}) {
      const nameMatches = matches(name)
      return city.locations.filter(location => nameMatches(location.name), max)
    }

    function location ({slug}) {
      return city.locations.get(slug)
    }

    function firstDate () {
      const d = reduceOccurrencesStarts((a, b) => a < b ? a : b)
      return d && datetime.datetime(d).format(datetime.HTML5_FMT.DATE)
    }

    function dateAfter () {
      const d = reduceOccurrencesStarts((a, b) => a < b ? b : a)
      return d && datetime.datetime(d).add(1, 'day').format(datetime.HTML5_FMT.DATE)
    }

    function reduceOccurrencesStarts (f) {
      if (city.events.all().length) {
        var ret = city.events.all()[0].occurrences[0].start
        city.events.all().forEach(event => {
          event.occurrences.forEach(occurrence => {
            ret = f(ret, occurrence.start)
          })
        })
        return ret
      } else {
        return null
      }
    }

    function events ({tag, location, artist, title, dates, max}) {
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

      const titleMatches = matches(title)

      function select (event) {
        if (tag && !(new Set(event.tags.slugs).has(tag))) {
          return false
        }
        if (location && event.location.slug !== location) {
          return false
        }
        if (artist && event.artist.slug !== artist) {
          return false
        }
        if (!titleMatches(event.title)) {
          return false
        }
        if (dates && !event.occurrences.some(selectOccurrence(dates))) {
          return false
        }
        return true
      }

      return city.events.filterMap(select, max, makeEvent)
    }

    function event ({id}) {
      return makeEvent(city.events.get(id))
    }

    const {slug, name} = city

    return {slug, name, tags, locations, location, firstDate, dateAfter, events, event}
  }

  return {generation, artists, artist, putArtist, cities, city, putLocation, putEvent, deleteEvent}
}

function matches (needles) {
  if (needles) {
    needles = normalizeString(needles).split(/\s+/)
    return function (haystack) {
      if (!haystack) {
        return false
      }
      haystack = normalizeString(haystack)
      return needles.every(needle => haystack.indexOf(needle) !== -1)
    }
  } else {
    return function (haystack) {
      return true
    }
  }
}

function normalizeString (s) {
  // https://stackoverflow.com/a/37511463/905845
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

const encapsulateData = (function () {
  const artistSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.array().required().items(Joi.string()),
    website: Joi.string()
  })

  const locationSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.array().required().items(Joi.string()),
    website: Joi.string()
  })

  const tagSchema = Joi.object({
    slug: makeSlugSchema().required(),
    title: Joi.string().required()
  })

  const eventSchema = Joi.object({
    id: Joi.string().required().regex(/[a-zA-Z0-9]+/),
    artist: makeSlugSchema(),
    title: Joi.string(),
    location: makeSlugSchema().required(),
    tags: Joi.array().required().min(1).items(makeSlugSchema()),
    occurrences: Joi.array().required().min(1).items(Joi.object({
      start: Joi.string().required()
    }))
  })

  const citySchema = Joi.object({
    name: Joi.string().required(),
    locations: Joi.object().required().pattern(makeSlugSchema(), locationSchema),
    tags: Joi.array().required().items(tagSchema),
    events: Joi.array().required().items(eventSchema)
  })

  const dataSchema = Joi.object({
    _: Joi.object().required().keys({
      sequences: Joi.object().required().keys({
        events: Joi.number().integer().min(0).required()
      })
    }),
    artists: Joi.object().required().pattern(makeSlugSchema(), artistSchema),
    cities: Joi.object().required().pattern(makeSlugSchema(), citySchema)
  })

  function makeSlugSchema () {
    return Joi.string().regex(/^[a-z][-a-z0-9]*$/)
  }

  return encapsulateData

  function encapsulateData (data) {
    data._ = data._ || {}
    data._.sequences = data._.sequences || {}
    data._.sequences.events = data._.sequences.events || 0

    data.artists = data.artists || {}
    Object.values(data.artists).forEach(artist => {
      artist.description = artist.description || []
    })

    data.cities = data.cities || {}
    Object.values(data.cities).forEach(city => {
      city.locations = city.locations || {}
      Object.values(city.locations).forEach(location => {
        location.description = location.description || []
      })
      city.tags = city.tags || []
      city.events = city.events || []
      city.events.forEach(event => {
        if (!event.id) {
          event.id = nextEventId(data)
        }
      })
    })

    Joi.attempt(data, dataSchema)

    const artists = dictOfThingsBySlug({
      things: data.artists,
      schema: artistSchema,
      name: 'artist',
      encapsulate: ({name, description, website}) => ({name, description, website})
    })

    return {
      artists,
      cities: dictOfThingsBySlug({
        things: data.cities,
        schema: citySchema,
        name: 'city',
        encapsulate: ({name, locations, tags, events}) => {
          locations = dictOfThingsBySlug({
            things: locations,
            schema: locationSchema,
            name: 'location',
            encapsulate: ({name, description, website}) => ({name, description, website})
          })
          tags = listOfThingsWithSlug({
            things: tags,
            name: 'tag',
            encapsulate: ({slug, title}) => ({slug, title})
          })

          return {
            name,
            locations,
            tags,
            events: listOfThingsWithId({
              things: events,
              schema: eventSchema,
              name: 'event',
              nextId: nextEventId,
              encapsulate: ({id, title, artist, location, tags: tags_, occurrences}) => ({
                id,
                title,
                artist: slugOf({slug: artist, things: artists}),
                location: slugOf({slug: location, things: locations}),
                tags: listOfSlugsOf({slugs: tags_, things: tags}),
                occurrences
              })
            })
          }
        }
      })
    }

    function nextEventId () {
      const id = hashids.encode(data._.sequences.events)
      data._.sequences.events++
      return id
    }
  }

  function dictOfThingsBySlug ({things, schema, name, encapsulate}) {
    all()

    return {get, all, filter, put}

    function get (slug) {
      const thing = things[slug]
      if (thing) {
        return make(slug, thing)
      } else {
        throw new Error('No ' + name + ' with slug "' + slug + '"')
      }
    }

    function all () {
      return Object.entries(things).map(([slug, thing]) => make(slug, thing))
    }

    function filter (select, max) {
      var selected = all().filter(select)
      if (max && selected.length > max) {
        return null
      } else {
        return selected
      }
    }

    function put (thing) {
      const {slug} = thing
      thing = Object.assign({}, thing)
      delete thing.slug
      Joi.attempt(thing, schema)
      things[slug] = thing
      return make(slug, thing)
    }

    function make (slug, thing) {
      return Object.assign({slug}, encapsulate(thing))
    }
  }

  function slugOf ({slug, things}) {
    resolve()

    return {slug, resolve}

    function resolve () {
      return slug && things.get(slug)
    }
  }

  function listOfSlugsOf ({slugs, things}) {
    resolve()

    return {slugs, resolve}

    function resolve () {
      return slugs.map(slug => things.get(slug))
    }
  }

  function listOfThingsWithId ({things, schema, name, nextId, encapsulate}) {
    all()

    return {get, all, filterMap, put, del}

    function get (id) {
      const thing = things.filter(thing => thing.id === id)
      if (thing.length === 1) {
        return encapsulate(thing[0])
      } else {
        throw new Error('No ' + name + ' with id "' + id + '"')
      }
    }

    function all () {
      return things.map(encapsulate)
    }

    function filterMap (select, max, f) {
      var selected = all().filter(select)
      if (max && selected.length > max) {
        return null
      } else {
        return selected.map(f)
      }
    }

    function put (thing) {
      encapsulate(thing)
      if (thing.id) {
        Joi.attempt(thing, schema)
        var replaced = false
        for (var i = 0; i !== things.length; ++i) {
          if (things[i].id === thing.id) {
            replaced = true
            things[i] = thing
            break
          }
        }
        if (!replaced) {
          throw new Error('No ' + name + ' with id "' + thing.id + '"')
        }
      } else {
        thing = Object.assign({}, thing)
        thing.id = nextId()
        Joi.attempt(thing, schema)
        things.push(thing)
      }
      return encapsulate(thing)
    }

    function del (id) {
      for (var i = 0; i !== things.length; ++i) {
        const thing = things[i]
        if (thing.id === id) {
          things.splice(i, 1)
          return encapsulate(thing)
        }
      }
      throw new Error('No ' + name + ' with id "' + id + '"')
    }
  }

  function listOfThingsWithSlug ({things, name, encapsulate}) {
    all()

    const bySlug = Object.assign({}, ...things.map(thing => {
      const o = {}
      o[thing.slug] = thing
      return o
    }))

    // If we ever add a 'put' function, it has to update bySlug
    return {get, all}

    function get (slug) {
      const thing = bySlug[slug]
      if (thing) {
        return encapsulate(thing)
      } else {
        throw new Error('No ' + name + ' with slug "' + slug + '"')
      }
    }

    function all () {
      return things.map(encapsulate)
    }
  }
}())

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

Object.assign(exports, {make, forTest: {makeRoot: makeSyncRoot, schema, encapsulateData}})
