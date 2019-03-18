'use strict'

/* globals describe, it */

const assert = require('assert').strict
const gql = require('graphql-tag')

const testUtils = require('./test-utils')

describe('API integration test', function () {
  // These tests *do* know the internal MongoDB storage schema.
  // This makes them fragile to implementation changes.
  // So, we should test here only things related to strorage schema.

  const { run, reset, makeMongodbClient } = testUtils()

  async function make (data, { clock } = {}) {
    const dbArtists = Object.entries(data.artists || {}).map(([slug, artist]) => Object.assign({ _id: slug }, artist))
    const dbLocations = [].concat(...Object.entries(data.cities || {}).map(function ([citySlug, city]) {
      const { locations } = city
      delete city.locations
      return Object.entries(locations).map(([slug, location]) => Object.assign({ _id: citySlug + ':' + slug, citySlug }, location))
    }))
    const dbEvents = [].concat(...Object.entries(data.cities || {}).map(function ([citySlug, city]) {
      const { events } = city
      delete city.events
      return (events || []).map(function (event) {
        const _id = event.id
        delete event.id
        return Object.assign({ _id, citySlug }, event)
      })
    }))
    const dbCities = Object.entries(data.cities || {}).map(([slug, city]) => Object.assign({ _id: slug }, city))

    const client = await makeMongodbClient()
    const db = client.db('splight')

    async function setCollection (name, items) {
      const coll = db.collection(name)
      if (items.length > 0) {
        await coll.insertMany(items)
      }
    }

    await reset()
    await setCollection('artists', dbArtists)
    await setCollection('cities', dbCities)
    await setCollection('locations', dbLocations)
    await setCollection('events', dbEvents)

    async function checkRequest (query, expected) {
      const actual = await run(gql(query), {})
      assert.deepEqual(actual, expected)
    }

    return { checkRequest }
  }

  describe('city.dates', function () {
    const get = '{cities{slug firstDate dateAfter}}'

    it('returns dates', async function () {
      const { checkRequest } = await make({
        cities: {
          'no-events': {
            name: 'City',
            locations: { 'location': { name: 'Location' } },
            tags: [{ slug: 'tag', title: 'Tag' }]
          },
          'single-occurrence': {
            name: 'City',
            locations: { 'location': { name: 'Location' } },
            tags: [{ slug: 'tag', title: 'Tag' }],
            events: [{
              location: 'location',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }]
            }]
          },
          'several-occurrences': {
            name: 'City',
            locations: { 'location': { name: 'Location' } },
            tags: [{ slug: 'tag', title: 'Tag' }],
            events: [{
              location: 'location',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }, { start: '2018-07-13T12:00' }, { start: '2018-07-15T12:00' }]
            }]
          },
          'several-events': {
            name: 'City',
            locations: { 'location': { name: 'Location' } },
            tags: [{ slug: 'tag', title: 'Tag' }],
            events: [
              {
                location: 'location',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-14T12:00' }]
              },
              {
                location: 'location',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-13T12:00' }]
              },
              {
                location: 'location',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-15T12:00' }]
              }
            ]
          }
        }
      })

      await checkRequest(
        get,
        { data: { cities: [
          { slug: 'no-events', firstDate: null, dateAfter: null },
          { slug: 'single-occurrence', firstDate: '2018-07-14', dateAfter: '2018-07-15' },
          { slug: 'several-occurrences', firstDate: '2018-07-13', dateAfter: '2018-07-16' },
          { slug: 'several-events', firstDate: '2018-07-13', dateAfter: '2018-07-16' }
        ] } }
      )
    })
  })

  describe('filtering queries', function () {
    describe('artists', function () {
      it('filters by name', async function () {
        const { checkRequest } = await make({
          artists: {
            'ok-literal': { name: 'name aeiou' },
            'ok-reversed': { name: 'aeiou name' },
            'ok-uppercase': { name: 'NAME AEIOU' },
            'ok-accentuated': { name: 'name àéïôù' },
            'ko-not-all-words': { name: 'name' },
            'ko-title-no-match': { name: 'foobar' }
          }
        })

        await checkRequest(
          '{artists(name:"name aeiou"){slug}}',
          {
            data: { artists: [{ slug: 'ok-literal' }, { slug: 'ok-reversed' }, { slug: 'ok-uppercase' }, { slug: 'ok-accentuated' }] }
          }
        )
      })
    })

    describe('city.locations', function () {
      it('filters by name', async function () {
        const { checkRequest } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: {
                'ok-literal': { name: 'name aeiou' },
                'ok-reversed': { name: 'aeiou name' },
                'ok-uppercase': { name: 'NAME AEIOU' },
                'ok-accentuated': { name: 'name àéïôù' },
                'ko-not-all-words': { name: 'name' },
                'ko-title-no-match': { name: 'foobar' }
              }
            }
          }
        })

        await checkRequest(
          '{cities{locations(name:"name aeiou"){slug}}}',
          {
            data: { cities: [{
              locations: [{ slug: 'ok-literal' }, { slug: 'ok-reversed' }, { slug: 'ok-uppercase' }, { slug: 'ok-accentuated' }]
            }] }
          }
        )
      })
    })

    describe('city.events', function () {
      it('filters by tag', async function () {
        const { checkRequest } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }, { slug: 'other-tag', title: 'Other tag' }],
              events: [
                {
                  id: 'ok-single',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: 'ok-main',
                  location: 'location',
                  tags: ['tag', 'other-tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: 'ok-secondary',
                  location: 'location',
                  tags: ['other-tag', 'tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: 'ko',
                  location: 'location',
                  tags: ['other-tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(tag:"tag"){id}}}',
          { data: { cities: [{ events: [{ id: 'ok-single' }, { id: 'ok-main' }, { id: 'ok-secondary' }] }] } }
        )
      })

      it('filters by location', async function () {
        const { checkRequest } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' }, 'other-location': { name: 'Other location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  id: 'ok',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: 'ko-other-location',
                  location: 'other-location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(location:"location"){id}}}',
          { data: { cities: [{ events: [{ id: 'ok' }] }] } }
        )
      })

      it('filters by artist', async function () {
        const { checkRequest } = await make({
          artists: { 'artist': { name: 'Artist' }, 'artist-2': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  id: 'ok',
                  artist: 'artist',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: 'ko-other-artist',
                  artist: 'artist-2',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: 'ko-no-artist',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(artist:"artist"){id}}}',
          { data: { cities: [{ events: [{ id: 'ok' }] }] } }
        )
      })

      it('filters by title', async function () {
        const { checkRequest } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  title: 'title aeiou',
                  id: 'ok-literal',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  title: 'aeiou title',
                  id: 'ok-reversed',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  title: 'TITLE AEIOU',
                  id: 'ok-uppercase',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  title: 'title àéïôù',
                  id: 'ok-accentuated',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: 'ko-no-title',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  title: 'title',
                  id: 'ko-not-all-words',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  title: 'foobar',
                  id: 'ko-title-no-match',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(title:"title aeiou"){id}}}',
          { data: { cities: [{ events: [{ id: 'ok-literal' }, { id: 'ok-reversed' }, { id: 'ok-uppercase' }, { id: 'ok-accentuated' }] }] } }
        )
      })

      it('filters by dates', async function () {
        const { checkRequest } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  id: 'ko-before',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-13T23:59' }]
                },
                {
                  id: 'ok-1',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-12T12:00' }, { start: '2018-07-14T00:00' }, { start: '2018-07-16T12:00' }]
                },
                {
                  id: 'ok-2',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-15T23:59' }]
                },
                {
                  id: 'ko-after',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-16T00:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(dates:{start:"2018-07-14", after:"2018-07-16"}){id}}}',
          { data: { cities: [{ events: [{ id: 'ok-1' }, { id: 'ok-2' }] }] } }
        )
      })
    })
  })
})
