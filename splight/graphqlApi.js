'use strict'

const graphql = require('graphql')
const moment = require('moment')

const schema = graphql.buildSchema(`
  type Query {
    cities: [City!]!
    city(slug: ID!): City
  }

  scalar Date
  scalar Time
  scalar DateTime

  type City {
    slug: ID!
    name: String!
    tags: [Tag!]!
    firstDate: Date!
    dateAfter: Date!
    days(first: Date!, after: Date!): [Day!]!
  }

  type Tag {
    slug: ID!
    title: String!
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

  type Artist {
    slug: ID!
    name: String!
  }

  type Location {
    slug: ID!
    name: String!
  }
`)

function makeRoot ({load}) {
  const data = load()

  async function cities () {
    const {artists, cities} = (await data)
    return Object.entries(cities).map(([slug, city]) => city_(artists, slug, city))
  }

  async function city ({slug}) {
    const {artists, cities} = (await data)
    const city = cities[slug]
    if (city) {
      return city_(artists, slug, city)
    }
  }

  return {cities, city}
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

function city_ (artists, slug, city) {
  const {name, locations, events} = city
  const tagsBySlug = city.tags
  const tags = Object.entries(tagsBySlug).map(([slug, tag]) => Object.assign({slug}, tag))

  const dayEventsByDate = lazy(() => {
    const dayEventsByDate = {}

    events.forEach(({location, artist, occurences, tags, title}) => {
      tags = tags.map(tag => Object.assign({slug: tag}, tagsBySlug[tag]))
      occurences.forEach(({start}) => {
        start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)
        const dayEvent = {
          time: start.format(moment.HTML5_FMT.TIME),
          title,
          location: Object.assign({slug: location}, locations[location]),
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

  return {slug, name, tags, firstDate, dateAfter, days}
}

function make (config) {
  const rootValue = makeRoot(config)

  function request ({requestString, variableValues}) {
    return graphql.graphql(schema, requestString, rootValue, undefined, variableValues)
  }

  return {schema, rootValue, request}
}

Object.assign(exports, {make})
