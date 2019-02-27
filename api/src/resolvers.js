'use strict'

const Hashids = require('hashids') // @todo Do not rely on sequences, let MongoDB assign ids

const hashids = new Hashids('', 10)

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

  // @todo See test-vue/apollo for how to paginate and "subscribe to more"
  async artists (_, { name }, { dbArtists }) {
    const nameMatches = matches(name)
    // @todo This is BAD: we must filter and limit in MongoDB
    return (await dbArtists.find().toArray()).filter(artist => nameMatches(artist.name))
  },
  async artist (_, { slug }, { dbArtists }) {
    const dbArtist = await dbArtists.findOne({ _id: slug })
    if (dbArtist) {
      return dbArtist
    } else {
      throw new Error(`No artist with slug "${slug}"`)
    }
  },

  // @todo Deduplicate with artists
  async cities (_, { name }, { dbCities }) {
    const nameMatches = matches(name)
    return (await dbCities.find().toArray()).filter(city => nameMatches(city.name))
  },
  async city (_, { slug }, { dbCities }) {
    const dbCity = await dbCities.findOne({ _id: slug })
    if (dbCity) {
      return dbCity
    } else {
      throw new Error(`No city with slug "${slug}"`)
    }
  },

  async validateArtist (_, { forInsert, artist: { slug, name, description, website, image } }, { dbArtists }) {
    const validation = {}
    if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
      validation.slug = "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets."
    } else if (forInsert && await dbArtists.countDocuments({ _id: slug }) > 0) {
      validation.slug = 'Les slugs de chaque artiste doivent être uniques.'
    }
    if (!name) {
      validation.name = "Le nom d'un artiste ne peut pas être vide."
    }
    return validation
  },
  async validateLocation (_, { forInsert, citySlug, location: { slug, name, description, address, phone, website, image } }, { dbLocations }) {
    const _id = citySlug + ':' + slug

    const validation = {}
    if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
      validation.slug = "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets."
    } else if (forInsert && await dbLocations.countDocuments({ _id }) > 0) {
      validation.slug = "Les slugs de chaque lieu doivent être uniques au sein d'une ville."
    }
    if (!name) {
      validation.name = "Le nom d'un lieu ne peut pas être vide."
    }
    return validation
  },
  async validateEvent (_, { citySlug, event: { id, title, artist, location, tags, occurrences, reservationPage } }) {
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
}

const Artist = {
  slug ({ _id }) {
    return _id
  },
  description ({ description }) {
    return description || []
  }
}

const City = {
  slug ({ _id }) {
    return _id
  },
  // @todo Deduplicate with artists
  async locations ({ _id: citySlug }, { name }, { dbLocations }) {
    const nameMatches = matches(name)
    return (await dbLocations.find({ citySlug }).toArray()).filter(location => nameMatches(location.name))
  },
  async location ({ _id: citySlug }, { slug }, { dbLocations }) {
    const dbLocation = await dbLocations.findOne({ _id: citySlug + ':' + slug })
    if (dbLocation) {
      return dbLocation
    } else {
      throw new Error(`No location with slug "${slug}"`)
    }
  },

  async events ({ _id: citySlug }, { tag, location, artist, title, dates }, { dbEvents }) {
    const filters = []

    // const titleMatches = matches(title)

    // function selectOccurrence ({ start, after }) {
    //   return function (occurrence) {
    //     if (start && occurrence.start < start) {
    //       return false
    //     }
    //     if (after && occurrence.start >= after) {
    //       return false
    //     }
    //     return true
    //   }
    // }

    // var filtered = events_.filter(({ title }) => titleMatches(title))
    // if (tag) {
    //   filtered = filtered.filter(({ tags }) => tags.some(({ slug }) => slug === tag))
    // }
    // if (location) {
    //   filtered = filtered.filter(({ location: { slug } }) => slug === location)
    // }
    // if (artist) {
    //   filtered = filtered.filter(({ artist: a }) => a && a.slug === artist)
    // }
    // if (dates) {
    //   const occurrenceMatches = selectOccurrence(dates)
    //   filtered = filtered.filter(({ occurrences }) => occurrences.some(occurrenceMatches))
    // }
    // if (max && filtered.length > max) {
    //   return null
    // } else {
    //   return filtered
    // }
    return (await dbEvents.find({ citySlug }).toArray()).filter(event => filters.every(filter => filter(event)))
  },
  async event (_, { id }, { dbEvents }) {
    const dbEvent = await dbEvents.findOne({ _id: id })
    if (dbEvent) {
      return dbEvent
    } else {
      throw new Error(`No event with id "${id}"`)
    }
  }
}

const Location = {
  slug ({ _id }) {
    return _id.split(':')[1]
  },
  description ({ description }) {
    return description || []
  },
  address ({ address }) {
    return address || []
  }
}

const Event = {
  id ({ _id }) {
    return _id
  },
  location ({ citySlug, location: locationSlug }, _, { dbLocations }) {
    return dbLocations.findOne({ _id: citySlug + ':' + locationSlug })
  },
  artist ({ artist: artistSlug }, _, { dbArtists }) {
    return dbArtists.findOne({ _id: artistSlug })
  },
  async tags ({ citySlug, tags: tagSlugs }, _, { dbCities }) {
    const dbCity = await dbCities.findOne({ _id: citySlug })
    const tagsBySlug = Object.assign({}, ...(dbCity.tags || []).map(({ slug, title, image }) => {
      const o = {}
      o[slug] = { slug, title, image }
      return o
    }))

    return tagSlugs.map(tagSlug => tagsBySlug[tagSlug])
  }
}

const Mutation = {
  async putArtist (_, { artist: { slug, name, description, website, image } }, { dbArtists }) {
    const validation = await Query.validateArtist(...arguments) // By chance, not providing forInsert will have the same effect as forInsert: false
    if (Object.keys(validation).length) {
      throw new Error(validation.slug || validation.name)
    }
    const _id = slug
    const dbArtist = { _id, name, description, website, image }
    if (!dbArtist.description.length) delete dbArtist.description
    if (!dbArtist.website) delete dbArtist.website
    if (!dbArtist.image) delete dbArtist.image
    await dbArtists.replaceOne({ _id }, dbArtist, { upsert: true })
    return dbArtist
  },

  async putLocation (_, { citySlug, location: { slug, name, description, address, phone, website, image } }, { dbLocations }) {
    const validation = await Query.validateLocation(...arguments) // By chance, not providing forInsert will have the same effect as forInsert: false
    if (Object.keys(validation).length) {
      throw new Error(validation.slug || validation.name)
    }
    const _id = citySlug + ':' + slug
    const dbLocation = { _id, citySlug, name, description, address, phone, website, image }
    if (!dbLocation.description.length) delete dbLocation.description
    if (!dbLocation.address.length) delete dbLocation.address
    if (!dbLocation.website) delete dbLocation.website
    if (!dbLocation.phone) delete dbLocation.phone
    if (!dbLocation.image) delete dbLocation.image
    await dbLocations.replaceOne({ _id }, dbLocation, { upsert: true })
    return dbLocation
  },

  async putEvent (_, { citySlug, event: { id: _id, title, artist, location, tags, occurrences, reservationPage } }, { dbSequences, dbCities, dbEvents }) {
    const validation = await Query.validateEvent(...arguments)
    if (Object.keys(validation).length) {
      throw new Error(validation)
    }

    const dbEvent = { citySlug, location, tags, occurrences, reservationPage, artist, title }
    if (!dbEvent.reservationPage) delete dbEvent.reservationPage
    if (!dbEvent.artist) delete dbEvent.artist
    if (!dbEvent.title) delete dbEvent.title

    if (_id) {
      dbEvent._id = _id
      const ret = await dbEvents.replaceOne({ _id }, dbEvent)
      if (_id && ret.matchedCount === 0) {
        throw new Error(`No event with id "${_id}"`)
      }
    } else {
      dbEvent._id = hashids.encode(await nextSequenceValue(dbSequences, 'events')) // @todo Let MongoDB generate ObjectIds
      const ret = await dbEvents.insertOne(dbEvent)
      dbEvent._id = ret.insertedId
    }

    return dbEvent
  }
}

async function nextSequenceValue (dbSequences, _id) {
  const sequence = (await dbSequences.findOneAndUpdate({ _id }, { $inc: { value: 1 } }, { upsert: true })).value
  if (sequence) {
    return sequence.value
  } else {
    return 0
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

module.exports = { Query, Mutation, Artist, City, Location, Event }
