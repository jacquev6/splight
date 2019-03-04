'use strict'

/* globals describe, context, before, it */

const gql = require('graphql-tag')

const testUtils = require('./test-utils')

describe('API black-box test', function () {
  // These tests don't know anything about the underlying implementation.
  // I expect this will make them very robust to changes in said implementation.
  // So, this is where we should test all externaly-observable behavior.

  const { run, success, error, reset } = testUtils()

  const artistFields = `
    fragment artistFields on Artist {
      slug
      name
      description
      website
      image
    }
  `

  const putArtist = gql`mutation($artist: IArtist!) { putArtist(artist: $artist) { slug } }`

  const getArtist = gql`
    query($slug: ID!) { artist(slug: $slug) { ...artistFields } }

    ${artistFields}
  `

  const getArtists = gql`query { artists { slug } }`

  const cityFields = `
    fragment cityFields on City {
      slug
      name
      tags {
        ...tagFields
      }
      image
      allTagsImage
    }

    fragment tagFields on Tag {
      slug
      title
      image
    }
  `

  const putCity = gql`mutation($city: ICity!) { putCity(city: $city) { slug } }`

  const getCity = gql`
    query($slug: ID!) { city(slug: $slug) { ...cityFields } }

    ${cityFields}
  `

  const getCities = gql`query { cities { slug } }`

  describe('putCity', function () {
    before(reset)

    it('creates simplest city', async function () {
      await success(
        putCity, { city: { slug: 'city-slug', name: 'City Name', tags: [] } },
        { putCity: { slug: 'city-slug' } }
      )
      await success(
        getCity, { slug: 'city-slug' },
        { city: { slug: 'city-slug', name: 'City Name', tags: [], image: null, allTagsImage: null } }
      )
    })

    it('edits city', async function () {
      await success(
        putCity, { city: { slug: 'city-slug', name: 'City Name 2', tags: [], image: 'http://foo.bar/img1', allTagsImage: 'http://foo.bar/img2' } },
        { putCity: { slug: 'city-slug' } }
      )
      await success(
        getCity, { slug: 'city-slug' },
        { city: { slug: 'city-slug', name: 'City Name 2', tags: [], image: 'http://foo.bar/img1', allTagsImage: 'http://foo.bar/img2' } }
      )
    })

    it('resets city', async function () {
      await success(
        putCity, { city: { slug: 'city-slug', name: 'City Name', tags: [] } },
        { putCity: { slug: 'city-slug' } }
      )
      await success(
        getCity, { slug: 'city-slug' },
        { city: { slug: 'city-slug', name: 'City Name', tags: [], image: null, allTagsImage: null } }
      )
    })
  })

  describe('putArtist', function () {
    before(reset)

    it('creates simplest artist', async function () {
      await success(
        putArtist, { artist: { slug: 'artist-slug', name: 'Artist Name', description: [] } },
        { putArtist: { slug: 'artist-slug' } }
      )
      await success(
        getArtist, { slug: 'artist-slug' },
        { artist: { slug: 'artist-slug', name: 'Artist Name', description: [], website: null, image: null } }
      )
    })

    it('edits artist', async function () {
      await success(
        putArtist, { artist: { slug: 'artist-slug', name: 'Artist Name 2', description: ['Artist description 1', 'Artist description 2'], website: 'http://foo.bar/', image: 'http://foo.bar/img1' } },
        { putArtist: { slug: 'artist-slug' } }
      )
      await success(
        getArtist, { slug: 'artist-slug' },
        { artist: { slug: 'artist-slug', name: 'Artist Name 2', description: ['Artist description 1', 'Artist description 2'], website: 'http://foo.bar/', image: 'http://foo.bar/img1' } }
      )
    })

    it('resets artist', async function () {
      await success(
        putArtist, { artist: { slug: 'artist-slug', name: 'Artist Name', description: [] } },
        { putArtist: { slug: 'artist-slug' } }
      )
      await success(
        getArtist, { slug: 'artist-slug' },
        { artist: { slug: 'artist-slug', name: 'Artist Name', description: [], website: null, image: null } }
      )
    })
  })

  context('with a single simplest city', function () {
    before(async () => {
      await reset()
      await run(putCity, { city: { slug: 'city-slug', name: 'City Name', tags: [] } })
    })

    it('lists a city', async function () {
      await success(
        getCities,
        { cities: [{ slug: 'city-slug' }] }
      )
    })

    it('gets a city', async function () {
      await success(
        getCity, { slug: 'city-slug' },
        { city: { slug: 'city-slug', name: 'City Name', tags: [], image: null, allTagsImage: null } }
      )
    })
  })

  context('with a single simplest artist', function () {
    before(async () => {
      await reset()
      await run(
        putArtist, { artist: { slug: 'artist-slug', name: 'Artist Name', description: [] } }
      )
    })

    it('lists an artist', async function () {
      await success(
        getArtists,
        { artists: [{ slug: 'artist-slug' }] }
      )
    })

    it('gets an artist', async function () {
      await success(
        getArtist, { slug: 'artist-slug' },
        { artist: { slug: 'artist-slug', name: 'Artist Name', description: [], website: null, image: null } }
      )
    })
  })

  context('without data', function () {
    before(reset)

    it('finds no artist', async function () {
      await success(
        getArtists,
        { artists: [] }
      )
    })

    it("doesn't get an artist", async function () {
      await error(
        getArtist, { slug: 'artist-slug' },
        'No artist with slug "artist-slug"'
      )
    })

    it('finds no city', async function () {
      await success(
        getCities,
        { cities: [] }
      )
    })

    it("doesn't get a city", async function () {
      await error(
        getCity, { slug: 'city-slug' },
        'No city with slug "city-slug"'
      )
    })
  })
})
