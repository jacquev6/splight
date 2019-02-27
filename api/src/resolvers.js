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
  }
}

const Mutation = {
  async putArtist (_, { artist }, { dbArtists }) {
    const validation = await Query.validateArtist(...arguments) // By chance, not providing forInsert will have the same effect as forInsert: false
    if (Object.keys(validation).length) {
      throw new Error(validation.slug || validation.name)
    }
    const { slug: _id, name, description, website, image } = artist
    const dbArtist = { _id, name, description, website, image }
    if (!dbArtist.description.length) delete dbArtist.description
    if (!dbArtist.website) delete dbArtist.website
    if (!dbArtist.image) delete dbArtist.image
    await dbArtists.replaceOne({ _id }, dbArtist, { upsert: true })
    return dbArtist
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

module.exports = { Query, Mutation, Artist }
