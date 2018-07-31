'use strict'

const graphql = require('graphql')
const moment = require('moment')

const schemaString = require('./graphqlApi.gqls')

const schema = graphql.buildSchema(schemaString)

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

  for (var name of ['artists', 'putArtist', 'cities', 'city', 'putLocation', 'addEvent']) {
    ret[name] = forward(name)
  }

  return ret
}

function makeSyncRoot (data) {
  const [artists_, getArtist] = slugify(data.artists, 'artist')

  function artists () {
    return artists_
  }

  function putArtist ({artist: {slug, name}}) {
    data.artists[slug] = {name}
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

  function addEvent ({event}) {
    const {citySlug, title, artist, location, tags, occurences} = event
    delete event.citySlug
    const city = getCity(citySlug)
    const [tags_, getTag] = slugify(city.tags, 'tag') // eslint-disable-line
    const [locations, getLocation] = slugify(city.locations, 'location') // eslint-disable-line
    const ret = Object.assign(
      {
        title,
        location: getLocation(location),
        tags: tags.map(getTag),
        occurences
      },
      artist ? {artist: getArtist(artist)} : {}
    )
    city.events.push(event)
    return ret
  }

  function city_ (city) {
    const {slug, name, events} = city
    const [tags, getTag] = slugify(city.tags, 'tag')
    const [locations, getLocation] = slugify(city.locations, 'location')

    const dayEventsByDate = lazy(() => {
      const dayEventsByDate = {}

      events.forEach(({location, artist, occurences, tags, title}) => {
        tags = tags.map(getTag)
        occurences.forEach(({start}) => {
          start = moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true)
          const dayEvent = {
            time: start.format(moment.HTML5_FMT.TIME),
            title,
            location: getLocation(location),
            tags,
            mainTag: tags[0],
            occurences
          }
          if (artist) {
            dayEvent.artist = getArtist(artist)
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

    return {slug, name, tags, locations, firstDate, dateAfter, days, addEvent}
  }

  return {artists, putArtist, cities, city, putLocation, addEvent}
}

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

Object.assign(exports, {make})
