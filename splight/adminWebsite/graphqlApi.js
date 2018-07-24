'use strict'

const graphql = require('graphql')
const Joi = require('joi')
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

const slug = Joi.string().required().min(1)
const name = Joi.string().required().min(1)

const dataSchema = Joi.object({
  artists: Joi.object().required().pattern(
    Joi.string(),
    Joi.object({
      name
    })
  ),
  cities: Joi.array().required().items(Joi.object({
    slug,
    name,
    tags: Joi.array().required().items(Joi.object({
      slug,
      title: name
    })),
    locations: Joi.object().required().pattern(
      Joi.string(),
      Joi.object({
        name
      })
    ),
    events: Joi.array().required().items(Joi.object({
      artist: Joi.string(),
      location: Joi.string().required(),
      occurences: Joi.array().required().items(Joi.object({
        start: Joi.string().regex(/^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]T[0-9][0-9]:[0-9][0-9]$/)
      })),
      tags: Joi.array().required().items(Joi.string()),
      title: Joi.string()
    }))
  }))
}).strict()

function query_ ({load, save}) {
  const data = load().then(data => Joi.attempt(data, dataSchema))

  const citiesBySlug = data.then(({cities}) => {
    const citiesBySlug = {}
    cities.forEach(c => {
      citiesBySlug[c.slug] = c
    })
    return citiesBySlug
  })

  async function cities () {
    const {artists, cities} = (await data)
    return cities.map(city => city_(artists, city))
  }

  async function city ({slug}) {
    const {artists} = (await data)
    const city = (await citiesBySlug)[slug]
    if (city) {
      return city_(artists, city)
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

function city_ (artists, city) {
  const {slug, name, tags, locations, events} = city

  const dayEventsByDate = lazy(() => {
    const tagsBySlug = {}
    tags.forEach(tag => {
      tagsBySlug[tag.slug] = tag
    })

    const dayEventsByDate = {}

    events.forEach(({location, artist, occurences, tags, title}) => {
      occurences.forEach(({start}) => {
        start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)
        const dayEvent = {
          time: start.format(moment.HTML5_FMT.TIME),
          title,
          location: Object.assign({slug: location}, locations[location]),
          tags: tags.map(tag => Object.assign({slug: tag}, tagsBySlug[tag]))
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

Object.assign(exports, {schema, makeRoot: query_})
