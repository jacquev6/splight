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
  artists (_, { name }, { data }) {
    return data.artists.filter({ needle: name })
  },
  artist (_, { slug }, { data }) {
    return data.artists.getBySlug(slug)
  },

  cities (_, { name }, { data }) {
    return data.cities.filter({ needle: name })
  },
  city (_, { slug }, { data }) {
    return data.cities.getBySlug(slug)
  },

  validateArtist (_, { forInsert, artist }, { data }) {
    return data.artists.validate(forInsert, artist)
  },
  validateCity (_, { forInsert, city }, { data }) {
    return data.cities.validate(forInsert, city)
  },
  async validateLocation (_, { forInsert, citySlug, location }, { data }) {
    return (await data.locations(citySlug)).validate(forInsert, location)
  },
  async validateEvent (_, { forInsert, citySlug, event }, { data }) {
    return (await data.events(citySlug)).validate(forInsert, event)
  }
}

const City = {
  async locations ({ slug }, { name }, { data }) {
    return (await data.locations(slug)).filter({ needle: name })
  },
  async location ({ slug }, { slug: locationSlug }, { data }) {
    return (await data.locations(slug)).getBySlug(locationSlug)
  },

  async tags ({ slug }, _, { data }) {
    return (await data.tags(slug)).getAll()
  },

  async events ({ slug }, { tag, location, artist, title, dates }, { data }) {
    const filters = []

    // @todo Do this filtering inside MongoDB
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

    return (await (await data.events(slug)).filter({ needle: title })).filter(event => filters.every(filter => filter(event)))
  },
  async event ({ slug }, { id }, { data }) {
    return (await data.events(slug)).getById(id)
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

// @todo Find min and max date in MongoDB
async function reduceOccurrencesStarts (citySlug, data, f) {
  const events = await (await data.events(citySlug)).getAll()

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
    return (await data.locations(citySlug)).getBySlug(location)
  },
  artist ({ artist }, _, { data }) {
    return data.artists.tryGetBySlug(artist)
  },
  async tags ({ citySlug, tags }, _, { data }) {
    const tags_ = await data.tags(citySlug)
    return Promise.all(tags.map(tag => tags_.getBySlug(tag)))
  }
}

const Mutation = {
  putArtist (_, { artist }, { data }) {
    return data.artists.put(artist)
  },
  putCity (_, { city }, { data }) {
    return data.cities.put(city)
  },
  async putLocation (_, { citySlug, location }, { data }) {
    return (await data.locations(citySlug)).put(location)
  },
  async putEvent (_, { citySlug, event }, { data }) {
    return (await data.events(citySlug)).put(event)
  },
  async deleteEvent (_, { citySlug, eventId }, { data }) {
    return (await data.events(citySlug)).deleteById(eventId)
  }
}

module.exports = { Query, Mutation, City, Event }
