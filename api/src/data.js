'use strict'

const Hashids = require('hashids')

const words__ = require('./words')

const hashids = new Hashids('', 10)

module.exports = async function (mongoDbClient) {
  const database = mongoDbClient.db('splight')

  const sequences = database.collection('sequences')

  // Keeping messages together should help with localization
  const messages = {
    badSlugFormat: "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets.",
    artist: {
      notFound: slug => `Pas d'artiste avec le slug "${slug}"`,
      duplicatedSlug: 'Les slugs de chaque artiste doivent être uniques.',
      emptyName: "Le nom d'un artiste ne peut pas être vide."
    },
    city: {
      notFound: slug => `Pas de ville avec le slug "${slug}"`,
      duplicatedSlug: 'Les slugs de chaque ville doivent être uniques.',
      emptyName: "Le nom d'une ville ne peut pas être vide."
    },
    tag: {
      notFound: (citySlug, slug) => `Pas de catégorie avec le slug "${slug}" dans la ville avec le slug "${citySlug}"`
    },
    location: {
      notFound: (citySlug, slug) => `Pas de lieu avec le slug "${slug}" dans la ville avec le slug "${citySlug}"`,
      duplicatedSlug: "Les slugs de chaque lieu doivent être uniques au sein d'une ville.",
      emptyName: "Le nom d'un lieu ne peut pas être vide."
    },
    event: {
      notFound: (citySlug, id) => `Pas d'événement avec l'id "${id}" dans la ville avec le slug "${citySlug}"`,
      noOccurrence: 'Un événement doit avoir au moins une représentation.',
      noTitleOrArtist: 'Un événement doit avoir un titre ou un artiste.',
      noLocation: 'Un événement doit avoir un lieu.',
      noTag: 'Un événement doit avoir au moins une catégorie.'
    }
  }

  const words_ = await words__(database)

  const artists = await (async function () {
    const collection = database.collection('artists')

    const words = await words_({
      collection: 'artists',
      id ({ _id }) { return _id },
      texts ({ name }) { return [name] }
    })

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
        throw new Error(messages.artist.notFound(slug))
      }
    }

    async function existsBySlug (slug) {
      return !!(await collection.countDocuments({ _id: slug }))
    }

    async function filter ({ needle }) {
      const query = {}
      try {
        const slugs = await words.retrieve(needle)
        query['_id'] = { $in: slugs }
      } catch (e) {}
      return collection.find(query).sort({ name: 1 }).map(toPublic).toArray()
    }

    async function validate (forInsert, { slug, name }) {
      const validation = {}

      if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
        validation.slug = messages.badSlugFormat
      } else if (forInsert && await existsBySlug(slug)) {
        validation.slug = messages.artist.duplicatedSlug
      }

      if (!name) {
        validation.name = messages.artist.emptyName
      }

      return validation
    }

    async function put (artist) {
      throwValidationError(await validate(false, artist))

      const dbArtist = toDatabase(artist)
      await collection.replaceOne({ _id: dbArtist._id }, dbArtist, { upsert: true })
      await words.record(dbArtist) // Maybe this could be made asynchronous?
      return toPublic(dbArtist)
    }

    return { tryGetBySlug, getBySlug, existsBySlug, filter, validate, put }

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

      if (!artist.description || !artist.description.length) delete artist.description
      if (!artist.website) delete artist.website
      if (!artist.image) delete artist.image

      return artist
    }
  })()

  const cities = await (async function () {
    const collection = database.collection('cities')

    const words = await words_({
      collection: 'cities',
      id ({ _id }) { return _id },
      texts ({ name }) { return [name] }
    })

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
        throw new Error(messages.city.notFound(slug))
      }
    }

    async function existsBySlug (slug) {
      return !!(await collection.countDocuments({ _id: slug }))
    }

    async function filter ({ needle }) {
      const query = {}
      try {
        const slugs = await words.retrieve(needle)
        query['_id'] = { $in: slugs }
      } catch (e) {}
      return collection.find(query).sort({ name: 1 }).map(toPublic).toArray()
    }

    async function validate (forInsert, { slug, name }) {
      const validation = {}

      if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
        validation.slug = messages.badSlugFormat
      } else if (forInsert && await existsBySlug(slug)) {
        validation.slug = messages.city.duplicatedSlug
      }

      if (!name) {
        validation.name = messages.city.emptyName
      }

      return validation
    }

    async function put (city) {
      throwValidationError(await validate(false, city))

      const dbCity = toDatabase(city)
      await collection.replaceOne({ _id: dbCity._id }, dbCity, { upsert: true })
      await words.record(dbCity)
      return toPublic(dbCity)
    }

    return { tryGetBySlug, getBySlug, existsBySlug, filter, validate, put }

    function toPublic ({ _id, name, image, allTagsImage }) {
      return {
        slug: _id,
        name,
        image,
        allTagsImage
      }
    }

    function toDatabase ({ slug, name, tags, image, allTagsImage }) {
      const city = {
        _id: slug,
        name,
        tags,
        image,
        allTagsImage
      }
      if (!city.image) delete city.image
      if (!city.tags || !city.tags.length) delete city.tags
      if (!city.allTagsImage) delete city.allTagsImage

      return city
    }
  })()

  const locations = await (async function () {
    const collection = database.collection('locations')

    const words = await words_({
      collection: 'locations',
      id ({ _id }) { return _id },
      texts ({ name }) { return [name] }
    })

    return async function (citySlug) {
      await cities.getBySlug(citySlug)

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
          throw new Error(messages.location.notFound(citySlug, slug))
        }
      }

      async function existsBySlug (slug) {
        return !!(await collection.countDocuments({ _id: citySlug + ':' + slug }))
      }

      async function filter ({ needle }) {
        const query = { citySlug }
        try {
          const slugs = await words.retrieve(needle)
          query['_id'] = { $in: slugs }
        } catch (e) {}
        return collection.find(query).sort({ name: 1 }).map(toPublic).toArray()
      }

      async function validate (forInsert, { slug, name }) {
        const validation = {}

        if (!slug.match(/^[a-z][-a-z0-9]*$/)) {
          validation.slug = messages.badSlugFormat
        } else if (forInsert && await existsBySlug(slug)) {
          validation.slug = messages.location.duplicatedSlug
        }

        if (!name) {
          validation.name = messages.location.emptyName
        }

        return validation
      }

      async function put (location) {
        throwValidationError(await validate(false, location))

        const dbLocation = toDatabase(location)
        await collection.replaceOne({ _id: dbLocation._id }, dbLocation, { upsert: true })
        await words.record(dbLocation)
        return toPublic(dbLocation)
      }

      return { tryGetBySlug, getBySlug, existsBySlug, filter, validate, put }

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

        if (!location.description || !location.description.length) delete location.description
        if (!location.website) delete location.website
        if (!location.image) delete location.image
        if (!location.phone) delete location.phone
        if (!location.address || !location.address.length) delete location.address

        return location
      }
    }
  })()

  const tags = (function () {
    const collection = database.collection('cities')

    return async function (citySlug) {
      await cities.getBySlug(citySlug)

      const tags = (await collection.findOne({ _id: citySlug })).tags || []

      const tagsBySlug = Object.assign({}, ...tags.map(({ slug, title, image }) => {
        const o = {}
        o[slug] = { slug, title, image }
        return o
      }))

      async function tryGetBySlug (slug) {
        const tag = tagsBySlug[slug]
        if (tag) {
          return toPublic(tag)
        }
      }

      async function getBySlug (slug) {
        const tag = await tryGetBySlug(slug)
        /* istanbul ignore else: dead defensive code */
        if (tag) {
          return tag
        } else {
          throw new Error(messages.tag.notFound(citySlug, slug))
        }
      }

      async function existsBySlug (slug) {
        return !!(await tryGetBySlug(slug))
      }

      async function getAll () {
        return tags
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

  const events = await (async function () {
    const collection = database.collection('events')

    const words = await words_({
      collection: 'events',
      id ({ _id }) { return _id },
      texts ({ title }) {
        if (title) {
          return [title]
        } else { return [] }
      }
    })

    return async function (citySlug) {
      await cities.getBySlug(citySlug)

      const tags_ = await tags(citySlug)
      const locations_ = await locations(citySlug)

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
          throw new Error(messages.event.notFound(citySlug, id))
        }
      }

      async function filter ({ needle }) {
        const query = { citySlug }
        try {
          const ids = await words.retrieve(needle)
          query['_id'] = { $in: ids }
        } catch (e) {}
        return collection.find(query).sort({ name: 1 }).map(toPublic).toArray()
      }

      // @todo Remove
      async function getAll () {
        return collection.find({ citySlug }).map(toPublic).toArray()
      }

      async function validate (forInsert, { id, title, artist, location, tags, occurrences, reservationPage }) {
        const validation = {}

        if (!title && !artist) {
          validation.title = messages.event.noTitleOrArtist
        }

        if (artist && !await artists.existsBySlug(artist)) {
          validation.artist = messages.artist.notFound(artist)
        }

        if (!location) {
          validation.location = messages.event.noLocation
        } else if (!await locations_.existsBySlug(location)) {
          validation.location = messages.location.notFound(citySlug, location)
        }

        if (!tags || !tags.length) {
          validation.tags = messages.event.noTag
        } else {
          await Promise.all(tags.map(async tag => {
            if (!await tags_.existsBySlug(tag)) {
              validation.tags = messages.tag.notFound(citySlug, tag)
            }
          }))
        }

        if (!occurrences || !occurrences.length) {
          validation.occurrences = messages.event.noOccurrence
        }

        return validation
      }

      async function put (event) {
        throwValidationError(await validate(false, event))

        const dbEvent = toDatabase(event)

        if (dbEvent._id) {
          const ret = await collection.replaceOne({ _id: dbEvent._id }, dbEvent)
          if (ret.matchedCount === 0) {
            throw new Error(messages.event.notFound(citySlug, dbEvent._id))
          }
        } else {
          dbEvent._id = hashids.encode(await nextSequenceValue('events'))
          await collection.insertOne(dbEvent)
        }

        await words.record(dbEvent)

        return toPublic(dbEvent)
      }

      async function deleteById (_id) {
        const event = await collection.findOne({ citySlug, _id })
        if (!event) {
          throw new Error(messages.event.notFound(citySlug, _id))
        }

        await collection.deleteOne({ citySlug, _id })
        await words.remove(event)

        return toPublic(event)
      }

      return { tryGetById, getById, filter, getAll, validate, put, deleteById }

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
