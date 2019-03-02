'use strict'

/* globals describe, context, beforeEach, it */

const gql = require('graphql-tag')

const testUtils = require('./test-utils')

describe('API black-box test', function () {
  // These tests don't know anything about the underlying implementation.
  // I expect this will make them very robust to changes in said implementation.
  // So, this is where we should test all externaly-observable behavior.

  const { run, success } = testUtils()

  context('without data', function () {
    it('finds no artist', async function () {
      await success(
        gql`query{artists{slug}}`,
        { artists: [] }
      )
    })

    it('finds no city', async function () {
      await success(
        gql`query{cities{slug}}`,
        { cities: [] }
      )
    })
  })

  context('with a single simplest city', function () {
    beforeEach(async () => {
      await run(gql`mutation{putCity(city:{slug:"city-1",name:"City 1",tags:[]}){slug}}`)
    })

    it('lists a city', async function () {
      await success(
        gql`query{cities{slug}}`,
        { cities: [{ slug: 'city-1' }] }
      )
    })

    it('gets a city', async function () {
      await success(
        gql`query{city(slug:"city-1"){slug name tags{slug} image allTagsImage}}`,
        { city: { slug: 'city-1', name: 'City 1', tags: [], image: null, allTagsImage: null } }
      )
    })
  })

  context('with a single simplest artist', function () {
    beforeEach(async () => {
      await run(gql`mutation{putArtist(artist:{slug:"artist-1",name:"Artist 1",description:[]}){slug}}`)
    })

    it('lists an artist', async function () {
      await success(
        gql`query{artists{slug}}`,
        { artists: [{ slug: 'artist-1' }] }
      )
    })

    it('gets an artist', async function () {
      await success(
        gql`query{artist(slug:"artist-1"){slug name description website image}}`,
        { artist: { slug: 'artist-1', name: 'Artist 1', description: [], website: null, image: null } }
      )
    })
  })
})
