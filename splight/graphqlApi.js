'use strict'

const graphql = require('graphql')
const moment = require('moment')

const schema = graphql.buildSchema(`
  type Query {
    artists: [Artist!]!
    cities: [City!]!
    city(slug: ID!): City
  }

  scalar Date
  scalar Time
  scalar DateTime

  type Artist {
    slug: ID!
    name: String!
  }

  type City {
    slug: ID!
    name: String!
    tags: [Tag!]!
    locations: [Location!]!
    # events: [Events!]!
    firstDate: Date!
    dateAfter: Date!
    days(first: Date!, after: Date!): [Day!]!
  }

  type Tag {
    slug: ID!
    title: String!
  }

  type Location {
    slug: ID!
    name: String!
  }

  type Event {
    title: String
    artist: Artist
    location: Location!
    tags: [Tag!]!
    occurences: [Occurence!]!
  }

  type Occurence {
    start: DateTime!
  }

  type Day {
    date: Date!
    events: [DayEvent!]!
  }

  type DayEvent {
    time: Time!
    title: String
    artist: Artist
    location: Location!
    mainTag: Tag!
    tags: [Tag!]!
  }

  type Mutation {
    putArtist(artist: IArtist): Artist!
    city(slug: ID!): MCity
  }

  input IArtist {
    slug: ID!
    name: String!
  }

  type MCity {
    putLocation(location: ILocation): Location!
    addEvent(event: IEvent): Event!
  }

  input ILocation {
    slug: ID!
    name: String!
  }

  input IEvent {
    title: String
    artist: ID
    location: ID!
    tags: [ID!]!
    occurences: [IOccurence!]!
  }

  input IOccurence {
    start: DateTime!
  }
`)

function makeRoot ({load, save}) {
  const data = load()

  async function save_ () {
    save(await data)
  }

  async function artists () {
    const {artists} = (await data)
    return Object.entries(artists).map(([slug, artist]) => Object.assign({slug}, artist))
  }

  async function putArtist ({artist: {slug, name}}) {
    (await data).artists[slug] = {name}
    await save_()
    return {slug, name}
  }

  async function cities () {
    const {artists, cities} = (await data)
    return Object.entries(cities).map(([slug, city]) => city_(save_, artists, slug, city))
  }

  async function city ({slug}) {
    const {artists, cities} = (await data)
    const city = cities[slug]
    if (city) {
      return city_(save_, artists, slug, city)
    }
  }

  return {artists, putArtist, cities, city}
}

function lazy (thunk) {
  var computed = false
  var value = null

  function force () {
    if (!computed) {
      value = thunk()
      computed = true
    }
    return value
  }

  return {force}
}

function city_ (save_, artists, slug, city) {
  const {name, events} = city
  const tagsBySlug = city.tags
  const tags = Object.entries(tagsBySlug).map(([slug, tag]) => Object.assign({slug}, tag))
  const locationsBySlug = city.locations
  const locations = Object.entries(locationsBySlug).map(([slug, location]) => Object.assign({slug}, location))

  const dayEventsByDate = lazy(() => {
    const dayEventsByDate = {}

    events.forEach(({location, artist, occurences, tags, title}) => {
      tags = tags.map(tag => Object.assign({slug: tag}, tagsBySlug[tag]))
      occurences.forEach(({start}) => {
        start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)
        const dayEvent = {
          time: start.format(moment.HTML5_FMT.TIME),
          title,
          location: Object.assign({slug: location}, locationsBySlug[location]),
          tags,
          mainTag: tags[0]
        }
        if (artist) {
          dayEvent.artist = Object.assign({slug: artist}, artists[artist])
        }
        const day = start.format(moment.HTML5_FMT.DATE)
        var dayEvents = dayEventsByDate[day]
        if (!dayEvents) {
          dayEventsByDate[day] = dayEvents = []
        }
        dayEvents.push(dayEvent)
      })
    })

    for (var date in dayEventsByDate) {
      dayEventsByDate[date] = dayEventsByDate[date].sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0)
    }

    return dayEventsByDate
  })

  function firstDate () {
    return Object.keys(dayEventsByDate.force()).reduce((a, b) => a < b ? a : b)
  }

  function dateAfter () {
    return moment(
      Object.keys(dayEventsByDate.force()).reduce((a, b) => a > b ? a : b),
      moment.HTML5_FMT.DATE,
      true
    ).add(1, 'day').format(moment.HTML5_FMT.DATE)
  }

  function days ({first, after}) {
    first = moment(first, moment.HTML5_FMT.DATE, true)
    after = moment(after, moment.HTML5_FMT.DATE, true)
    const dayEventsByDate_ = dayEventsByDate.force()

    const days = []
    for (var d = first.clone(); d.isBefore(after); d.add(1, 'day')) {
      const date = d.format(moment.HTML5_FMT.DATE)
      days.push({
        date,
        events: dayEventsByDate_[date] || []
      })
    }
    return days
  }

  async function putLocation ({location: {slug, name}}) {
    city.locations[slug] = {name}
    await save_()
    return {slug, name}
  }

  async function addEvent ({event}) {
    function resolve(slug, things, name) {
      const thing = things[slug]
      if (thing) {
        return Object.assign({slug}, thing)
      } else {
        throw new Error('No ' + name + ' with slug "' + slug + '"')
      }
    }

    const {title, artist, location, tags, occurences} = event
    const ret = {
      title,
      artist: resolve(artist, artists, 'artist'),
      location: resolve(location, locationsBySlug, 'location'),
      tags: tags.map(tag => resolve(tag, tagsBySlug, 'tag')),
      occurences
    }
    city.events.push(event)
    await save_()
    return ret
  }

  return {slug, name, tags, locations, firstDate, dateAfter, days, putLocation, addEvent}
}

function make (config) {
  const rootValue = makeRoot(config)

  function request ({requestString, variableValues}) {
    return graphql.graphql(schema, requestString, rootValue, undefined, variableValues)
  }

  return {schema, rootValue, request}
}

Object.assign(exports, {make})
