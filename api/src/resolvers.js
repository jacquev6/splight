'use strict'

const moment = require('moment')

const Query = {
  viewer (_, __, { viewer }) {
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
  },

  instance () {
    const name = process.env.SPLIGHT_INSTANCE_NAME
    var warnings = []
    if (process.env.SPLIGHT_INSTANCE_WARNINGS) {
      warnings = process.env.SPLIGHT_INSTANCE_WARNINGS.split('\n')
    }
    return { name, warnings }
  },

  // @todo See test-vue/apollo for how to paginate and "subscribe to more"
  async artists (_, { name }, { data }) {
    const nameMatches = matches(name)
    // @todo Filter in data (same for all (cities, locations, events, ...))
    return (await data.artists.getAll()).filter(artist => nameMatches(artist.name))
  },
  async artist (_, { slug }, { data }) {
    return data.artists.getBySlug(slug)
  },

  async cities (_, { name }, { data }) {
    const nameMatches = matches(name)
    return (await data.cities.getAll()).filter(city => nameMatches(city.name))
  },
  async city (_, { slug }, { data }) {
    return data.cities.getBySlug(slug)
  },

  async validateArtist (_, { forInsert, artist }, { data }) {
    return data.artists.validate(forInsert, artist)
  },
  async validateCity (_, { forInsert, city }, { data }) {
    return data.cities.validate(forInsert, city)
  },
  async validateLocation (_, { forInsert, citySlug, location }, { data }) {
    return data.locations(citySlug).validate(forInsert, location)
  },
  async validateEvent (_, { forInsert, citySlug, event }, { data }) {
    return data.events(citySlug).validate(forInsert, event)
  }
}

const City = {
  // @todo Deduplicate with artists
  async locations ({ slug }, { name }, { data }) {
    const nameMatches = matches(name)
    return (await data.locations(slug).getAll()).filter(location => nameMatches(location.name))
  },
  async location ({ slug }, { slug: locationSlug }, { data }) {
    return data.locations(slug).getBySlug(locationSlug)
  },

  async tags ({ slug }, _, { data }) {
    return data.tags(slug).getAll()
  },

  async events ({ slug }, { tag, location, artist, title, dates }, { data }) {
    const titleMatches = matches(title)
    const filters = [({ title }) => titleMatches(title)]

    if (tag) {
      filters.push(({ tags }) => tags.includes(tag))
    }
    if (location) {
      filters.push(({ location: loc }) => loc === location)
    }
    if (artist) {
      filters.push(({ artist: art }) => art === artist)
    }

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
    if (dates) {
      const occurrenceMatches = selectOccurrence(dates)
      filters.push(({ occurrences }) => occurrences.some(occurrenceMatches))
    }

    return (await data.events(slug).getAll()).filter(event => filters.every(filter => filter(event)))
  },
  async event ({ slug }, { id }, { data }) {
    return data.events(slug).getById(id)
  },

  async firstDate ({ slug }, _, { data }) {
    const d = await reduceOccurrencesStarts(slug, data, (a, b) => a < b ? a : b)
    return d && moment(d, moment.HTML5_FMT.DATE_TIME).format(moment.HTML5_FMT.DATE)
  },
  async dateAfter ({ slug }, _, { data }) {
    const d = await reduceOccurrencesStarts(slug, data, (a, b) => a < b ? b : a)
    return d && moment(d, moment.HTML5_FMT.DATE_TIME).add(1, 'day').format(moment.HTML5_FMT.DATE)
  }
}

async function reduceOccurrencesStarts (citySlug, data, f) {
  const events = await data.events(citySlug).getAll()

  if (events.length && events[0].occurrences.length) {
    var ret = events[0].occurrences[0].start
    events.forEach(event => {
      event.occurrences.forEach(occurrence => {
        ret = f(ret, occurrence.start)
      })
    })
    return ret
  } else {
    return null
  }
}

const Event = {
  async location ({ citySlug, location }, _, { data }) {
    return data.locations(citySlug).getBySlug(location)
  },
  async artist ({ artist }, _, { data }) {
    return data.artists.tryGetBySlug(artist)
  },
  async tags ({ citySlug, tags }, _, { data }) {
    return Promise.all(tags.map(tag => data.tags(citySlug).getBySlug(tag)))
  }
}

const Mutation = {
  async putArtist (_, { artist }, { data }) {
    return data.artists.put(artist)
  },
  async putCity (_, { city }, { data }) {
    return data.cities.put(city)
  },
  async putLocation (_, { citySlug, location }, { data }) {
    return data.locations(citySlug).put(location)
  },
  async putEvent (_, { citySlug, event }, { data }) {
    return data.events(citySlug).put(event)
  },
  async deleteEvent (_, { citySlug, eventId }, { data }) {
    return data.events(citySlug).deleteById(eventId)
  }
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

module.exports = { Query, Mutation, City, Event }
