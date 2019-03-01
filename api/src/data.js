'use strict'

const Hashids = require('hashids') // @todo Do not rely on sequences, let MongoDB assign ids

const hashids = new Hashids('', 10)

module.exports = function (mongoDbClient) {
  const database = mongoDbClient.db('splight')

  const sequences = database.collection('sequences')

  const artists = (function () {
    const collection = database.collection('artists')

    // @todo Let MongoDB create ObjectIds, and use a unique index on slug
    async function tryGetBySlug (slug) {
      const artist = await collection.findOne({ _id: slug })
      if (artist) {
        return toPublic(artist)
      }
    }

    async function getBySlug (slug) {
      const artist = await tryGetBySlug(slug)
      if (artist) {
        return artist
      } else {
        throw new Error(`No artist with slug "${slug}"`)
      }
    }

    async function existsBySlug (slug) {
      return !!(await collection.countDocuments({ _id: slug }))
    }

    async function getAll () {
      return (await collection.find().toArray()).map(toPublic)
    }

    async function validate (forInsert, { slug, name }) {
      const validation = {}

      if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
        validation.slug = "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets."
      } else if (forInsert && await existsBySlug(slug)) {
        validation.slug = 'Les slugs de chaque artiste doivent être uniques.'
      }

      if (!name) {
        validation.name = "Le nom d'un artiste ne peut pas être vide."
      }

      return validation
    }

    async function put (artist) {
      throwValidationError(await validate(false, artist))

      const dbArtist = toDatabase(artist)
      await collection.replaceOne({ _id: dbArtist._id }, dbArtist, { upsert: true })
      return toPublic(dbArtist)
    }

    return { tryGetBySlug, getBySlug, existsBySlug, getAll, validate, put }

    function toPublic ({ _id, name, description, website, image }) {
      return {
        slug: _id,
        name,
        description: description || [],
        website,
        image
      }
    }

    function toDatabase ({ slug, name, description, website, image }) {
      const artist = {
        _id: slug,
        name,
        description,
        website,
        image
      }

      if (!artist.description.length) delete artist.description
      if (!artist.website) delete artist.website
      if (!artist.image) delete artist.image

      return artist
    }
  })()

  const cities = (function () {
    const collection = database.collection('cities')

    // @todo Let MongoDB create ObjectIds, and use a unique index on slug
    async function tryGetBySlug (slug) {
      const city = await collection.findOne({ _id: slug })
      if (city) {
        return toPublic(city)
      }
    }

    async function getBySlug (slug) {
      const city = await tryGetBySlug(slug)
      if (city) {
        return city
      } else {
        throw new Error(`No city with slug "${slug}"`)
      }
    }

    async function existsBySlug (slug) {
      return !!(await collection.countDocuments({ _id: slug }))
    }

    async function getAll () {
      return (await collection.find().toArray()).map(toPublic)
    }

    return { tryGetBySlug, getBySlug, existsBySlug, getAll }

    function toPublic ({ _id, name, image, allTagsImage }) {
      return {
        slug: _id,
        name,
        image,
        allTagsImage
      }
    }
  })()

  const locations = (function () {
    const collection = database.collection('locations')

    return function (citySlug) {
      // @todo Let MongoDB create ObjectIds, and use a unique index on (citySlug, slug)
      async function tryGetBySlug (slug) {
        const location = await collection.findOne({ _id: citySlug + ':' + slug })
        if (location) {
          return toPublic(location)
        }
      }

      async function getBySlug (slug) {
        const location = await tryGetBySlug(slug)
        if (location) {
          return location
        } else {
          throw new Error(`No location with slug "${slug}"`) // @todo Add `in city with slug "${citySlug}"`
        }
      }

      async function existsBySlug (slug) {
        return !!(await collection.countDocuments({ _id: citySlug + ':' + slug }))
      }

      async function getAll () {
        return (await collection.find({ citySlug }).toArray()).map(toPublic)
      }

      async function validate (forInsert, { slug, name }) {
        const validation = {}

        if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
          validation.slug = "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets."
        } else if (forInsert && await existsBySlug(slug)) {
          validation.slug = "Les slugs de chaque lieu doivent être uniques au sein d'une ville."
        }

        if (!name) {
          validation.name = "Le nom d'un lieu ne peut pas être vide."
        }

        return validation
      }

      async function put (location) {
        throwValidationError(await validate(false, location))

        const dbLocation = toDatabase(location)
        await collection.replaceOne({ _id: dbLocation._id }, dbLocation, { upsert: true })
        return toPublic(dbLocation)
      }

      return { tryGetBySlug, getBySlug, existsBySlug, getAll, validate, put }

      function toPublic ({ _id, name, description, website, image, phone, address }) {
        return {
          slug: _id.split(':')[1],
          citySlug,
          name,
          description: description || [],
          website,
          image,
          phone,
          address: address || []
        }
      }

      function toDatabase ({ slug, name, description, website, image, phone, address }) {
        const location = {
          _id: citySlug + ':' + slug,
          citySlug,
          name,
          description,
          website,
          image,
          phone,
          address
        }

        if (!location.description.length) delete location.description
        if (!location.website) delete location.website
        if (!location.image) delete location.image
        if (!location.phone) delete location.phone
        if (!location.address.length) delete location.address

        return location
      }
    }
  })()

  const tags = (function () {
    // @todo Put tags in their own collection indexed like locations?
    const collection = database.collection('cities')

    return function (citySlug) {
      const tags = (async function () {
        const city = await collection.findOne({ _id: citySlug })

        const tags = city.tags || []

        return {
          bySlug: Object.assign({}, ...tags.map(({ slug, title, image }) => {
            const o = {}
            o[slug] = { slug, title, image }
            return o
          })),
          ordered: tags
        }
      })()

      async function tryGetBySlug (slug) {
        const tag = (await tags).bySlug[slug]
        if (tag) {
          return toPublic(tag)
        }
      }

      async function getBySlug (slug) {
        const tag = await tryGetBySlug(slug)
        if (tag) {
          return tag
        } else {
          throw new Error(`No tag with slug "${slug}"`) // @todo Add `in city with slug "${citySlug}"`
        }
      }

      async function existsBySlug (slug) {
        return !!(await tryGetBySlug(slug))
      }

      async function getAll () {
        return (await tags).ordered
      }

      return { tryGetBySlug, getBySlug, existsBySlug, getAll }

      function toPublic ({ slug, title, image }) {
        return {
          slug,
          citySlug,
          title,
          image
        }
      }
    }
  })()

  const events = (function () {
    const collection = database.collection('events')

    return function (citySlug) {
      const tags_ = tags(citySlug)
      const locations_ = locations(citySlug)

      // @todo Let MongoDB create ObjectIds
      async function tryGetById (id) {
        const event = await collection.findOne({ citySlug, _id: id })
        if (event) {
          return toPublic(event)
        }
      }

      async function getById (id) {
        const event = await tryGetById(id)
        if (event) {
          return event
        } else {
          throw new Error(`No event with id "${id}"`) // @todo Add `in city with slug "${citySlug}"`
        }
      }

      async function existsById (id) {
        return !!(await collection.countDocuments({ citySlug, _id: id }))
      }

      async function getAll () {
        return (await collection.find({ citySlug }).toArray()).map(toPublic)
      }

      async function validate (forInsert, { id, title, artist, location, tags, occurrences, reservationPage }) {
        const validation = {}

        if (!title && !artist) {
          validation.title = 'Un événement doit avoir un titre ou un artiste.'
        }

        if (artist && !await artists.existsBySlug(artist)) {
          validation.artist = 'No artist with slug "' + artist + '"'
        }

        if (!location) {
          validation.location = 'Un événement doit avoir un lieu.'
        } else if (!await locations_.existsBySlug(location)) {
          validation.location = 'No location with slug "' + location + '"'
        }

        if (!tags.length) {
          validation.tags = 'Un événement doit avoir au moins une catégorie.'
        }
        await Promise.all(tags.map(async tag => {
          if (!await tags_.existsBySlug(tag)) {
            validation.tags = 'No tag with slug "' + tag + '"'
          }
        }))

        if (!occurrences.length) {
          validation.occurrences = 'Un événement doit avoir au moins une représentation.'
        }

        return validation
      }

      async function put (event) {
        throwValidationError(await validate(false, event))

        const dbEvent = toDatabase(event)

        if (dbEvent._id) {
          const ret = await collection.replaceOne({ _id: dbEvent._id }, dbEvent)
          if (ret.matchedCount === 0) {
            throw new Error(`No event with id "${dbEvent._id}"`)
          }
        } else {
          dbEvent._id = hashids.encode(await nextSequenceValue('events')) // @todo Let MongoDB generate ObjectIds
          await collection.insertOne(dbEvent)
        }

        return toPublic(dbEvent)
      }

      async function deleteById (_id) {
        const event = await collection.findOne({ citySlug, _id })
        if (!event) {
          throw new Error(`No event with id "${_id}"`) // @todo add "in city..."
        }

        await collection.deleteOne({ citySlug, _id })

        return toPublic(event)
      }

      return { tryGetById, getById, existsById, getAll, validate, put, deleteById }

      function toPublic ({ _id, title, artist, location, tags, occurrences, reservationPage }) {
        return {
          id: _id,
          citySlug,
          title,
          artist,
          location,
          tags,
          occurrences,
          reservationPage
        }
      }

      function toDatabase ({ id, title, artist, location, tags, occurrences, reservationPage }) {
        const event = {
          _id: id,
          citySlug,
          title,
          artist,
          location,
          tags,
          occurrences,
          reservationPage
        }

        if (!event.title) delete event.title
        if (!event.artist) delete event.artist
        if (!event.reservationPage) delete event.reservationPage

        return event
      }
    }
  })()

  return { artists, cities, tags, locations, events }

  function throwValidationError (validation) {
    const keys = Object.keys(validation)
    if (keys.length) {
      throw new Error(validation[keys[0]])
    }
  }

  async function nextSequenceValue (_id) {
    const sequence = (await sequences.findOneAndUpdate({ _id }, { $inc: { value: 1 } }, { upsert: true })).value
    if (sequence) {
      return sequence.value
    } else {
      return 0
    }
  }
}