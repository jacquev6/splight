'use strict'

const assert = require('assert').strict
const graphql = require('graphql')
const Hashids = require('hashids') // @todo Do not rely on sequences, let MongoDB assign ids
const moment = require('moment')
// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const schemaString = require('./graphqlApi.gqls')

// @todo See https://principledgraphql.com/operations#8-access-and-demand-control

const schema = graphql.buildSchema(schemaString)

const hashids = new Hashids('', 10)

const datetime = {
  datetime (s) {
    return moment(s, moment.HTML5_FMT.DATETIME_LOCAL, true)
  },
  now () {
    return moment()
  }
}

async function make ({ db, clock }) {
  clock = clock || datetime.now

  const artistsCollection = db.collection('artists')
  const citiesCollection = db.collection('cities')
  const locationsCollection = db.collection('locations')
  const eventsCollection = db.collection('events')
  const sequencesCollection = db.collection('sequences')

  async function nextSequenceValue (_id) {
    const sequence = (await sequencesCollection.findOneAndUpdate({ _id }, { $inc: { value: 1 } }, { upsert: true })).value
    if (sequence) {
      return sequence.value
    } else {
      return 0
    }
  }

  function viewer (_, { viewer }) {
    if (viewer) {
      return {
        authenticated: {
          name: viewer
        }
      }
    } else {
      return {
      }
    }
  }

  function generation () {
    const generationDate = clock()
    return {
      date: generationDate.format(moment.HTML5_FMT.DATE),
      dateAfter: generationDate.clone().startOf('isoWeek').add(5, 'weeks').format(moment.HTML5_FMT.DATE)
    }
  }

  async function validateArtist ({ forInsert, artist: { slug, name, description, website, image } }) {
    const validation = {}
    if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
      validation.slug = "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets."
    } else if (forInsert && await artistsCollection.countDocuments({ _id: slug }) > 0) {
      validation.slug = 'Les slugs de chaque artiste doivent être uniques.'
    }
    if (!name) {
      validation.name = "Le nom d'un artiste ne peut pas être vide."
    }
    return validation
  }

  async function putArtist ({ artist }) {
    const validation = await validateArtist({ forInsert: false, artist })
    if (Object.keys(validation).length) {
      throw new Error(validation.slug || validation.name)
    }
    const { slug, name, description, website, image } = artist
    const _id = slug
    const dbArtist = { _id, name, description, website, image }
    if (!dbArtist.image) {
      delete dbArtist.image
    }
    await artistsCollection.replaceOne({ _id }, dbArtist, { upsert: true })
    return makeArtist(dbArtist)
  }

  async function artist ({ slug }) {
    const dbArtist = await artistsCollection.findOne({ _id: slug })
    if (dbArtist) {
      return makeArtist(dbArtist)
    } else {
      throw new Error(`No artist with slug "${slug}"`)
    }
  }

  async function artists ({ name, max }) {
    const nameMatches = matches(name)
    // This is bad: we must filter and limit in MongoDB
    const artists = (await artistsCollection.find().toArray()).filter(artist => nameMatches(artist.name))
    if (max && artists.length > max) {
      return null
    } else {
      return Promise.all(artists.map(makeArtist))
    }
  }

  async function makeArtist ({ _id: slug, name, description, website, image }) {
    description = description || []
    return { slug, name, description, website, image }
  }

  async function city ({ slug }) {
    const dbCity = await citiesCollection.findOne({ _id: slug })
    if (dbCity) {
      return makeCity(dbCity)
    } else {
      throw new Error(`No city with slug "${slug}"`)
    }
  }

  async function cities ({ name, max }) {
    const nameMatches = matches(name)
    // This is bad: we must filter and limit in MongoDB
    const cities = (await citiesCollection.find().toArray()).filter(city => nameMatches(city.name))
    if (max && cities.length > max) {
      return null
    } else {
      return Promise.all(cities.map(makeCity))
    }
  }

  async function makeCity ({ _id: slug, name, tags: dbTags, image, allTagsImage }) {
    const citySlug = slug

    async function location ({ slug }) {
      const dbLocation = await locationsCollection.findOne({ _id: citySlug + ':' + slug })
      if (dbLocation) {
        return makeLocation(citySlug, dbLocation)
      } else {
        throw new Error(`No location with slug "${slug}"`)
      }
    }

    async function locations ({ name, max }) {
      const nameMatches = matches(name)
      // This is bad: we must filter and limit in MongoDB
      const locations = (await locationsCollection.find({ citySlug }).toArray()).filter(location => nameMatches(location.name))
      if (max && locations.length > max) {
        return null
      } else {
        return Promise.all(locations.map(location => makeLocation(citySlug, location)))
      }
    }

    const tags = await Promise.all((dbTags || []).map(async function ({ slug, title, image }) {
      return { slug, title, image }
    }))

    const tagsBySlug = Object.assign({}, ...tags.map(function (tag) {
      const o = {}
      o[tag.slug] = tag
      return o
    }))

    const dbEvents = await eventsCollection.find({ citySlug }).toArray()
    const events_ = await Promise.all(dbEvents.map(dbEvent => makeEvent(citySlug, tagsBySlug, dbEvent)))

    async function event ({ id }) {
      const _id = id
      const dbEvent = await eventsCollection.findOne({ _id })
      if (dbEvent) {
        return makeEvent(citySlug, tagsBySlug, dbEvent)
      } else {
        throw new Error(`No event with id "${id}"`)
      }
    }

    function events ({ tag, location, artist, title, dates, max }) {
      const titleMatches = matches(title)

      function selectOccurrence ({ start, after }) {
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

      var filtered = events_.filter(({ title }) => titleMatches(title))
      if (tag) {
        filtered = filtered.filter(({ tags }) => tags.some(({ slug }) => slug === tag))
      }
      if (location) {
        filtered = filtered.filter(({ location: { slug } }) => slug === location)
      }
      if (artist) {
        filtered = filtered.filter(({ artist: a }) => a && a.slug === artist)
      }
      if (dates) {
        const occurrenceMatches = selectOccurrence(dates)
        filtered = filtered.filter(({ occurrences }) => occurrences.some(occurrenceMatches))
      }
      if (max && filtered.length > max) {
        return null
      } else {
        return filtered
      }
    }

    function firstDate () {
      const d = reduceOccurrencesStarts((a, b) => a < b ? a : b)
      return d && datetime.datetime(d).format(moment.HTML5_FMT.DATE)
    }

    function dateAfter () {
      const d = reduceOccurrencesStarts((a, b) => a < b ? b : a)
      return d && datetime.datetime(d).add(1, 'day').format(moment.HTML5_FMT.DATE)
    }

    function reduceOccurrencesStarts (f) {
      if (events_.length) {
        var ret = events_[0].occurrences[0].start
        events_.forEach(event => {
          event.occurrences.forEach(occurrence => {
            ret = f(ret, occurrence.start)
          })
        })
        return ret
      } else {
        return null
      }
    }

    return { slug, name, tags, location, locations, event, events, allTagsImage, image, firstDate, dateAfter }
  }

  async function validateLocation ({ forInsert, citySlug, location: { slug, name, description, address, phone, website, image } }) {
    const _id = citySlug + ':' + slug

    const validation = {}
    if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
      validation.slug = "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets."
    } else if (forInsert && await locationsCollection.countDocuments({ _id }) > 0) {
      validation.slug = "Les slugs de chaque lieu doivent être uniques au sein d'une ville."
    }
    if (!name) {
      validation.name = "Le nom d'un lieu ne peut pas être vide."
    }
    return validation
  }

  async function putLocation ({ citySlug, location: { slug, name, description, address, phone, website, image } }) {
    const _id = citySlug + ':' + slug
    const dbLocation = { _id, citySlug, name, description, address, phone, website, image }
    if (!dbLocation.image) {
      delete dbLocation.image
    }
    if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
      throw new Error('Incorrect slug')
    }
    await locationsCollection.replaceOne({ _id }, dbLocation, { upsert: true })
    return makeLocation(citySlug, dbLocation)
  }

  async function makeLocation (citySlug, { _id, name, description, address, phone, website, image }) {
    assert.equal(_id.split(':').length, 2)
    const slug = _id.split(':')[1]
    description = description || []
    address = address || []
    return { slug, name, description, address, phone, website, image }
  }

  async function validateEvent ({ citySlug, event: { id, title, artist, location, tags, occurrences, reservationPage } }) {
    const validation = {}
    if (!title && !artist) {
      validation.title = 'Un événement doit avoir un titre ou un artiste.'
    }
    if (!location) {
      validation.location = 'Un événement doit avoir un lieu.'
    }
    if (!tags.length) {
      validation.tags = 'Un événement doit avoir au moins une catégorie.'
    }
    if (!occurrences.length) {
      validation.occurrences = 'Un événement doit avoir au moins une représentation.'
    }
    return validation
  }

  async function putEvent ({ citySlug, event: { id, title, artist, location, tags, occurrences, reservationPage } }) {
    const dbCity = await citiesCollection.findOne({ _id: citySlug })

    const tagsBySlug = Object.assign({}, ...await Promise.all((dbCity.tags || []).map(async function ({ slug, title, image }) {
      const o = {}
      o[slug] = { slug, title, image }
      return o
    })))

    var upsert = false
    var _id = id
    if (!_id) {
      upsert = true
      _id = hashids.encode(await nextSequenceValue('events'))
    }

    const dbEvent = Object.assign(
      { _id, citySlug, location, tags, occurrences },
      reservationPage ? { reservationPage } : {},
      artist ? { artist } : {},
      title ? { title } : {}
    )

    const event = await makeEvent(citySlug, tagsBySlug, dbEvent)

    const ret = await eventsCollection.replaceOne({ _id }, dbEvent, { upsert })
    // console.log(id, ret.matchedCount)
    if (id && ret.matchedCount === 0) {
      throw new Error(`No event with id "${id}"`)
    }

    return event
  }

  async function deleteEvent ({ citySlug, eventId }) {
    const dbCity = await citiesCollection.findOne({ _id: citySlug })

    const tagsBySlug = Object.assign({}, ...await Promise.all((dbCity.tags || []).map(async function ({ slug, title, image }) {
      const o = {}
      o[slug] = { slug, title, image }
      return o
    })))

    const _id = eventId

    const dbEvent = await eventsCollection.findOne({ _id })
    if (!dbEvent) {
      throw new Error(`No event with id "${eventId}"`)
    }
    const event = await makeEvent(citySlug, tagsBySlug, dbEvent)

    await eventsCollection.deleteOne({ _id })

    return event
  }

  async function makeEvent (citySlug, tagsBySlug, { _id, title, artist: artistSlug, location: locationSlug, tags: tagSlugs, occurrences, reservationPage }) {
    const id = _id
    const artist_ = artistSlug ? await artist({ slug: artistSlug }) : null
    const dbLocation = await locationsCollection.findOne({ _id: citySlug + ':' + locationSlug })
    // @todo Factorize with makeCity.location
    if (!dbLocation) {
      throw new Error(`No location with slug "${locationSlug}"`)
    }
    const location_ = await makeLocation(citySlug, dbLocation)
    const tags = tagSlugs.map(slug => {
      const tag = tagsBySlug[slug]
      if (!tag) {
        // @todo Factorize
        throw new Error(`No tag with slug "${slug}"`)
      }
      return tag
    })
    return { id, title, artist: artist_, location: location_, tags, occurrences, reservationPage }
  }

  const rootValue = {
    viewer,
    generation,
    validateArtist,
    putArtist,
    artist,
    artists,
    city,
    cities,
    validateLocation,
    putLocation,
    validateEvent,
    putEvent,
    deleteEvent
  }

  function request ({ requestString, variableValues }) {
    return graphql.graphql(schema, requestString, rootValue, undefined, variableValues)
  }

  return { schema, rootValue, request }
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

Object.assign(exports, { make })
