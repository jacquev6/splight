'use strict'

/* globals describe, it */

const assert = require('assert').strict
const gql = require('graphql-tag')
const Hashids = require('hashids')

const testUtils = require('./test-utils')

const hashids = new Hashids('', 10)

describe('API integration test', function () {
  // These tests *do* know the internal MongoDB storage schema.
  // This makes them fragile to implementation changes.
  // So, we should test here only things related to strorage schema.

  const { run, reset, makeMongodbClient } = testUtils()

  async function make (data = {}, { clock } = {}) {
    const dbArtists = Object.entries(data.artists || {}).map(([slug, artist]) => Object.assign({ _id: slug }, artist))
    const dbLocations = [].concat(...Object.entries(data.cities || {}).map(function ([citySlug, city]) {
      const { locations } = city
      delete city.locations
      return Object.entries(locations || {}).map(([slug, location]) => Object.assign({ _id: citySlug + ':' + slug, citySlug }, location))
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
    const dbSequences = Object.entries((data._ || {}).sequences || {}).map(([_id, value]) => ({ _id, value }))

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
    await setCollection('sequences', dbSequences)

    async function checkRequest (query, variables, expected) {
      if (!expected) { // A poor man's variadic function
        expected = variables
        variables = {}
      }
      const actual = await run(gql(query), variables)
      if (actual.errors) {
        delete actual.errors[0].extensions
        delete actual.errors[0].path
        delete actual.errors[0].locations
      }
      if (expected.errors) {
        delete expected.errors[0].path
        delete expected.errors[0].locations
      }
      assert.deepEqual(actual, expected)
    }

    async function checkData (expected) {
      const artists = await db.collection('artists').find().toArray()
      const cities = await db.collection('cities').find().toArray()
      const locations = await db.collection('locations').find().toArray()
      const events = await db.collection('events').find().toArray()
      const sequences = await db.collection('sequences').find().toArray()

      const actual = {
        _: {
          sequences: Object.assign({}, ...sequences.map(function (sequence) {
            const o = {}
            o[sequence._id] = sequence.value
            return o
          }))
        },
        artists: Object.assign({}, ...artists.map(function (artist) {
          const slug = artist._id
          delete artist._id
          const o = {}
          o[slug] = artist
          return o
        })),
        cities: Object.assign({}, ...cities.map(function (city) {
          const slug = city._id
          delete city._id
          city.locations = Object.assign({}, ...locations.map(function (location) {
            const slug = location._id.split(':')[1]
            delete location._id
            delete location.citySlug
            const o = {}
            o[slug] = location
            return o
          }))
          if (Object.keys(city.locations).length === 0) {
            delete city.locations
          }
          city.events = events.map(function (event) {
            event.id = event._id
            delete event._id
            delete event.citySlug
            return event
          })
          if (city.events.length === 0) {
            delete city.events
          }
          const o = {}
          o[slug] = city
          return o
        }))
      }
      if (Object.keys(actual._.sequences).length === 0) {
        delete actual._.sequences
      }
      if (Object.keys(actual._).length === 0) {
        delete actual._
      }
      if (Object.keys(actual.artists).length === 0) {
        delete actual.artists
      }
      if (Object.keys(actual.cities).length === 0) {
        delete actual.cities
      }
      assert.deepEqual(actual, expected)
    }

    return { checkRequest, checkData }
  }

  describe('full query', function () {
    const get = `{
      artists{slug name description website image}
      cities{
        slug
        name
        image
        allTagsImage
        tags{slug title image}
        locations{slug name description website image phone address}
        events{
          id
          title
          artist{slug name description website image}
          location{slug name description website image phone address}
          tags{slug title image}
          occurrences{start}
          reservationPage
        }
        firstDate
        dateAfter
      }
    }`

    it('returns everything on minimal city', async function () {
      const { checkRequest } = await make({
        artists: {
          'artist-1': { name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com' },
          'artist-2': { name: 'Artist 2' }
        },
        cities: {
          'city': {
            name: 'City',
            locations: {
              'location-1': { name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', phone: '0123456789', address: ['Location 1 address'] },
              'location-2': { name: 'Location 2' }
            },
            tags: [
              { slug: 'tag-1', title: 'Tag 1' },
              { slug: 'tag-2', title: 'Tag 2' }
            ]
          }
        }
      })

      await checkRequest(
        get,
        { data: {
          artists: [
            { slug: 'artist-1', name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com', image: null },
            { slug: 'artist-2', name: 'Artist 2', description: [], website: null, image: null }
          ],
          cities: [{
            slug: 'city',
            name: 'City',
            allTagsImage: null,
            tags: [
              { slug: 'tag-1', title: 'Tag 1', image: null },
              { slug: 'tag-2', title: 'Tag 2', image: null }
            ],
            locations: [
              { slug: 'location-1', name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', image: null, phone: '0123456789', address: ['Location 1 address'] },
              { slug: 'location-2', name: 'Location 2', description: [], website: null, image: null, phone: null, address: [] }
            ],
            events: [],
            firstDate: null,
            image: null,
            dateAfter: null
          }]
        } }
      )
    })

    it('returns everything on single city with a minimal and a full event', async function () {
      const { checkRequest } = await make(
        {
          artists: {
            'artist-1': { name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com', image: 'prefix/artists/artist-1.png' },
            'artist-2': { name: 'Artist 2' }
          },
          cities: {
            'city': {
              name: 'City',
              locations: {
                'location-1': { name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', phone: '0123456789', address: ['Location 1 address'], image: 'prefix/cities/city/locations/location-1.png' },
                'location-2': { name: 'Location 2' }
              },
              tags: [
                { slug: 'tag-1', title: 'Tag 1', image: 'prefix/cities/city/tags/tag-1.png' },
                { slug: 'tag-2', title: 'Tag 2' }
              ],
              events: [
                {
                  id: hashids.encode(0),
                  location: 'location-2',
                  tags: ['tag-2'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                },
                {
                  id: hashids.encode(1),
                  title: 'Title',
                  artist: 'artist-1',
                  location: 'location-1',
                  tags: ['tag-1'],
                  occurrences: [{ start: '2018-07-14T12:00' }],
                  reservationPage: 'http://reserve.com/'
                }
              ],
              allTagsImage: 'prefix/cities/city/all-tags.png',
              image: 'prefix/cities/city.png'
            }
          }
        }
      )

      await checkRequest(
        get,
        { data: {
          artists: [
            { slug: 'artist-1', name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com', image: 'prefix/artists/artist-1.png' },
            { slug: 'artist-2', name: 'Artist 2', description: [], website: null, image: null }
          ],
          cities: [{
            slug: 'city',
            name: 'City',
            allTagsImage: 'prefix/cities/city/all-tags.png',
            tags: [
              { slug: 'tag-1', title: 'Tag 1', image: 'prefix/cities/city/tags/tag-1.png' },
              { slug: 'tag-2', title: 'Tag 2', image: null }
            ],
            locations: [
              { slug: 'location-1', name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', image: 'prefix/cities/city/locations/location-1.png', phone: '0123456789', address: ['Location 1 address'] },
              { slug: 'location-2', name: 'Location 2', description: [], website: null, image: null, phone: null, address: [] }
            ],
            events: [
              {
                id: hashids.encode(0),
                artist: null,
                title: null,
                location: { slug: 'location-2', name: 'Location 2', description: [], website: null, image: null, phone: null, address: [] },
                tags: [{ slug: 'tag-2', title: 'Tag 2', image: null }],
                occurrences: [{ start: '2018-07-14T12:00' }],
                reservationPage: null
              },
              {
                id: hashids.encode(1),
                artist: { slug: 'artist-1', name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com', image: 'prefix/artists/artist-1.png' },
                title: 'Title',
                location: { slug: 'location-1', name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', image: 'prefix/cities/city/locations/location-1.png', phone: '0123456789', address: ['Location 1 address'] },
                tags: [{ slug: 'tag-1', title: 'Tag 1', image: 'prefix/cities/city/tags/tag-1.png' }],
                occurrences: [{ start: '2018-07-14T12:00' }],
                reservationPage: 'http://reserve.com/'
              }
            ],
            firstDate: '2018-07-14',
            image: 'prefix/cities/city.png',
            dateAfter: '2018-07-15'
          }]
        } }
      )
    })
  })

  describe('generation', function () {
    // it('uses injected date', async function () {
    //   const { checkRequest } = await make({}, { clock: () => moment('2018-08-15', moment.HTML5_FMT.SATE, true) })

    //   await checkRequest(
    //     '{generation{date dateAfter}}',
    //     { data: { generation: { date: '2018-08-15', dateAfter: '2018-09-17' } } }
    //   )
    // })
  })

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

    describe('artist', function () {
      it('finds artist by slug', async function () {
        const { checkRequest } = await make({ artists: { 'artist': { name: 'Artist' } } })

        await checkRequest(
          '{artist(slug:"artist"){name}}',
          { data: { artist: { name: 'Artist' } } }
        )
      })

      it("doesn't find artist by slug", async function () {
        const { checkRequest } = await make()

        await checkRequest(
          '{artist(slug:"artist-1"){name}}',
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 2 }],
              message: 'No artist with slug "artist-1"',
              path: ['artist']
            }]
          }
        )

        await checkRequest(
          '{artist(slug:"artist-2"){name}}',
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 2 }],
              message: 'No artist with slug "artist-2"',
              path: ['artist']
            }]
          }
        )
      })
    })

    describe('city', function () {
      const get = 'query($slug:ID!){city(slug:$slug){name}}'

      it("doesn't find city", async function () {
        const { checkRequest } = await make()

        await checkRequest(
          get,
          { slug: 'city-1' },
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 18 }],
              message: 'No city with slug "city-1"',
              path: ['city']
            }]
          }
        )

        await checkRequest(
          get,
          { slug: 'city-2' },
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 18 }],
              message: 'No city with slug "city-2"',
              path: ['city']
            }]
          }
        )
      })

      it('finds cities', async function () {
        const { checkRequest } = await make({
          cities: {
            'city-1': { name: 'City 1' },
            'city-2': { name: 'City 2' },
            'city-3': { name: 'City 3' }
          }
        })

        await checkRequest(get, { slug: 'city-1' }, { data: { city: { name: 'City 1' } } })
        await checkRequest(get, { slug: 'city-2' }, { data: { city: { name: 'City 2' } } })
        await checkRequest(get, { slug: 'city-3' }, { data: { city: { name: 'City 3' } } })
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

    describe('city.location', function () {
      it('finds location by slug', async function () {
        const { checkRequest } = await make({ cities: { 'city': { name: 'City', locations: { 'location': { name: 'Location' } } } } })

        await checkRequest(
          '{city(slug:"city"){location(slug:"location"){name}}}',
          { data: { city: { location: { name: 'Location' } } } }
        )
      })

      it("doesn't find location by slug", async function () {
        const { checkRequest } = await make({ cities: { 'city': { name: 'City' } } })

        await checkRequest(
          '{city(slug:"city"){location(slug:"location-1"){name}}}',
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 20 }],
              message: 'No location with slug "location-1" in city with slug "city"',
              path: ['city', 'location']
            }]
          }
        )

        await checkRequest(
          '{city(slug:"city"){location(slug:"location-2"){name}}}',
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 20 }],
              message: 'No location with slug "location-2" in city with slug "city"',
              path: ['city', 'location']
            }]
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

    describe('city.event', function () {
      it('finds event by id', async function () {
        const { checkRequest } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [{
                id: 'event',
                location: 'location',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-13T23:59' }]
              }]
            }
          }
        })

        await checkRequest(
          '{cities{event(id:"event"){id}}}',
          { data: { cities: [{ event: { id: 'event' } }] } }
        )
      })

      it("doesn't find event by id", async function () {
        const { checkRequest } = await make({ cities: { 'city': { name: 'City' } } })

        await checkRequest(
          '{cities{event(id:"event-1"){id}}}',
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 9 }],
              message: 'No event with id "event-1" in city with slug "city"',
              path: ['cities', 0, 'event']
            }]
          }
        )

        await checkRequest(
          '{cities{event(id:"event-2"){id}}}',
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 9 }],
              message: 'No event with id "event-2" in city with slug "city"',
              path: ['cities', 0, 'event']
            }]
          }
        )
      })
    })
  })

  describe('mutations', function () {
    const pngData = 'png data'
    const pngDataUrl = 'data:image/png;base64,' + Buffer.from(pngData).toString('base64')

    describe('putArtist', function () {
      const fields = 'slug name description website image'
      const get = `{artists{${fields}}}`
      const put = `mutation($artist:IArtist!){putArtist(artist:$artist){${fields}}}`

      it('adds an artist', async function () {
        const { checkRequest, checkData } = await make()

        await checkRequest(get, { data: { artists: [] } })

        await checkRequest(
          put,
          { artist: { slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } },
          { data: { putArtist: { slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } }
        )

        await checkData({ artists: { 'artist': { name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } })

        await checkRequest(get, { data: { artists: [{ slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl }] } })
      })

      it("doesn't add an artist with a bad slug", async function () {
        const { checkRequest, checkData } = await make()

        await checkRequest(
          put,
          { artist: { slug: 'A', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } },
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 28 }],
              message: "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets.",
              path: ['putArtist']
            }]
          }
        )

        await checkData({})
      })

      it('modifies an artist', async function () {
        const { checkRequest, checkData } = await make({ artists: { 'artist': { name: 'Artist' } } })

        await checkRequest(get, { data: { artists: [{ slug: 'artist', name: 'Artist', description: [], website: null, image: null }] } })

        await checkRequest(
          put,
          { artist: { slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } },
          { data: { putArtist: { slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } }
        )

        await checkData({ artists: { 'artist': { name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } })

        await checkRequest(get, { data: { artists: [{ slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl }] } })
      })

      it('modifies an artist - no change', async function () {
        const { checkRequest, checkData } = await make(
          { artists: { 'artist': { name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } }
        )

        await checkRequest(get, { data: { artists: [{ slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl }] } })

        await checkRequest(
          put,
          { artist: { slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } },
          { data: { putArtist: { slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } }
        )

        await checkData({ artists: { 'artist': { name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } })

        await checkRequest(get, { data: { artists: [{ slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl }] } })
      })

      it('modifies an artist - reset', async function () {
        const { checkRequest, checkData } = await make(
          { artists: { 'artist': { name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl } } }
        )

        await checkRequest(get, { data: { artists: [{ slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl }] } })

        await checkRequest(
          put,
          { artist: { slug: 'artist', name: 'New name', description: [] } },
          { data: { putArtist: { slug: 'artist', name: 'New name', description: [], website: null, image: null } } }
        )

        await checkData({ artists: { 'artist': { name: 'New name' } } })

        await checkRequest(get, { data: { artists: [{ slug: 'artist', name: 'New name', description: [], website: null, image: null }] } })
      })

      it('propagates changes to events', async function () {
        const { checkRequest } = await make(
          {
            artists: { 'artist': { name: 'Artist', image: pngDataUrl } },
            cities: {
              'city': {
                name: 'City',
                locations: { 'location': { name: 'Location' } },
                tags: [{ slug: 'tag', title: 'Tag' }],
                events: [{
                  artist: 'artist',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                }]
              }
            }
          }
        )

        const getEvents = `{cities{events{artist{${fields}}}}}`

        await checkRequest(
          getEvents,
          { data: { cities: [{ events: [{ artist: { slug: 'artist', name: 'Artist', description: [], website: null, image: pngDataUrl } }] }] } }
        )

        await checkRequest(
          put,
          { artist: { slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar' } },
          { data: { putArtist: { slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: null } } }
        )

        await checkRequest(
          getEvents,
          { data: { cities: [{ events: [{ artist: { slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: null } }] }] } }
        )
      })
    })

    describe('putLocation', function () {
      const fields = 'slug name description website image phone address'
      const get = `{cities{slug locations{${fields}}}}`
      const put = `mutation($citySlug:ID!,$location:ILocation!){putLocation(citySlug:$citySlug,location:$location){${fields}}}`

      it('adds a location', async function () {
        const { checkRequest, checkData } = await make({ cities: { 'city': { name: 'City' } } })

        await checkRequest(get, { data: { cities: [{ slug: 'city', locations: [] }] } })

        await checkRequest(
          put,
          { citySlug: 'city', location: { slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] } },
          { data: { putLocation: { slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] } } }
        )

        await checkData({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location', description: ['Description'], website: 'http://foo.bar', phone: '0123456789', address: ['Address'], image: pngDataUrl } }
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', locations: [{ slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] }] }] } })
      })

      // @todo Test adding a lodation to an unexisting city

      it("doesn't add a location with bad slug", async function () {
        const { checkRequest, checkData } = await make({ cities: { 'city': { name: 'City' } } })

        await checkRequest(
          put,
          { citySlug: 'city', location: { slug: 'L', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] } },
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 46 }],
              message: "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets.",
              path: ['putLocation']
            }]
          }
        )

        await checkData({ cities: { 'city': { name: 'City' } } })
      })

      it('modifies a location', async function () {
        const { checkRequest, checkData } = await make({
          cities: { 'city': { name: 'City', locations: { 'location': { name: 'Location' } } } }
        })

        await checkRequest(get, { data: { cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: [],
            website: null,
            image: null,
            phone: null,
            address: []
          }]
        }] } })

        await checkRequest(
          put,
          { citySlug: 'city', location: { slug: 'location', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] } },
          { data: { putLocation: { slug: 'location', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] } } }
        )

        await checkData({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'New name', description: ['Description'], website: 'http://foo.bar', phone: '0123456789', address: ['Address'], image: pngDataUrl } }
            }
          }
        })

        await checkRequest(get, { data: { cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'New name',
            description: ['Description'],
            website: 'http://foo.bar',
            image: pngDataUrl,
            phone: '0123456789',
            address: ['Address']
          }]
        }] } })
      })

      it('modifies a location - no change', async function () {
        const { checkRequest, checkData } = await make(
          { cities: { 'city': { name: 'City', locations: { 'location': { name: 'Location', description: ['Description'], website: 'http://foo.bar', phone: '0123456789', address: ['Address'], image: pngDataUrl } } } } }
        )

        await checkRequest(get, { data: { cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: ['Description'],
            website: 'http://foo.bar',
            image: pngDataUrl,
            phone: '0123456789',
            address: ['Address']
          }]
        }] } })

        await checkRequest(
          put,
          { citySlug: 'city', location: { slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] } },
          { data: { putLocation: { slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl, phone: '0123456789', address: ['Address'] } } }
        )

        await checkData({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location', description: ['Description'], website: 'http://foo.bar', phone: '0123456789', address: ['Address'], image: pngDataUrl } }
            }
          }
        })

        await checkRequest(get, { data: { cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: ['Description'],
            website: 'http://foo.bar',
            image: pngDataUrl,
            phone: '0123456789',
            address: ['Address']
          }]
        }] } })
      })

      it('modifies a location - reset', async function () {
        const { checkRequest, checkData } = await make(
          { cities: { 'city': { name: 'City', locations: { 'location': { name: 'Location', description: ['Description'], website: 'http://foo.bar', phone: '0123456789', address: ['1 rue de Gaule', '92000 Issy-ou-là'], image: pngDataUrl } } } } }
        )

        await checkRequest(get, { data: { cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: ['Description'],
            website: 'http://foo.bar',
            image: pngDataUrl,
            phone: '0123456789',
            address: ['1 rue de Gaule', '92000 Issy-ou-là']
          }]
        }] } })

        await checkRequest(
          put,
          { citySlug: 'city', location: { slug: 'location', name: 'New name', description: [], address: [] } },
          { data: { putLocation: { slug: 'location', name: 'New name', description: [], website: null, image: null, phone: null, address: [] } } }
        )

        await checkData({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'New name' } }
            }
          }
        })

        await checkRequest(get, { data: { cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'New name',
            description: [],
            website: null,
            image: null,
            phone: null,
            address: []
          }]
        }] } })
      })

      it('propagates changes to events', async function () {
        const { checkRequest } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [{
                location: 'location',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-14T12:00' }]
              }]
            }
          }
        })

        const getEvents = `{cities{events{location{${fields}}}}}`

        await checkRequest(
          getEvents,
          { data: { cities: [{ events: [{ location: { slug: 'location', name: 'Location', description: [], website: null, image: null, phone: null, address: [] } }] }] } }
        )

        await checkRequest(
          put,
          { citySlug: 'city', location: { slug: 'location', name: 'New name', description: [], image: pngDataUrl, address: [] } },
          { data: { putLocation: { slug: 'location', name: 'New name', description: [], website: null, image: pngDataUrl, phone: null, address: [] } } }
        )

        await checkRequest(
          getEvents,
          { data: { cities: [{ events: [{ location: { slug: 'location', name: 'New name', description: [], website: null, image: pngDataUrl, phone: null, address: [] } }] }] } }
        )
      })
    })

    describe('putEvent', function () {
      const fields = 'id title artist{name} location{name} tags{title} occurrences{start} reservationPage'
      const get = `{cities{slug events{${fields}}}}`
      const put = `mutation($citySlug:ID!,$event:IEvent!){putEvent(citySlug:$citySlug,event:$event){${fields}}}`

      it('adds an event', async function () {
        const { checkRequest, checkData } = await make({
          _: { sequences: { events: 12 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', events: [] }] } })

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              title: 'Title',
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }]
            }
          },
          { data: { putEvent: {
            id: hashids.encode(12),
            title: 'Title',
            artist: { name: 'Artist' },
            location: { name: 'Location' },
            tags: [{ title: 'Tag' }],
            occurrences: [{ start: '2018-07-14T12:00' }],
            reservationPage: null
          } } }
        )

        await checkData({
          _: { sequences: { events: 13 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [{
                id: hashids.encode(12),
                location: 'location',
                artist: 'artist',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-14T12:00' }],
                title: 'Title'
              }]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{
            slug: 'city',
            events: [{
              id: hashids.encode(12),
              title: 'Title',
              occurrences: [{ start: '2018-07-14T12:00' }],
              artist: { name: 'Artist' },
              location: { name: 'Location' },
              tags: [{ title: 'Tag' }],
              reservationPage: null
            }]
          }] } }
        )
      })

      it('adds an event without title', async function () {
        const { checkRequest, checkData } = await make({
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{ slug: 'city', events: [] }] } }
        )

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }]
            }
          },
          { data: { putEvent: {
            id: hashids.encode(0),
            title: null,
            artist: { name: 'Artist' },
            location: { name: 'Location' },
            tags: [{ title: 'Tag' }],
            occurrences: [{ start: '2018-07-14T12:00' }],
            reservationPage: null
          } } }
        )

        await checkData({
          _: { sequences: { events: 1 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [{
                id: hashids.encode(0),
                location: 'location',
                artist: 'artist',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-14T12:00' }]
              }]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{
            slug: 'city',
            events: [{
              id: hashids.encode(0),
              title: null,
              occurrences: [{ start: '2018-07-14T12:00' }],
              artist: { name: 'Artist' },
              location: { name: 'Location' },
              tags: [{ title: 'Tag' }],
              reservationPage: null
            }]
          }] } }
        )
      })

      it('adds an event without artist', async function () {
        const { checkRequest, checkData } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{ slug: 'city', events: [] }] } }
        )

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              title: 'Title',
              location: 'location',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }]
            }
          },
          { data: { putEvent: {
            id: hashids.encode(0),
            title: 'Title',
            artist: null,
            location: { name: 'Location' },
            tags: [{ title: 'Tag' }],
            occurrences: [{ start: '2018-07-14T12:00' }],
            reservationPage: null
          } } }
        )

        await checkData({
          _: { sequences: { events: 1 } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [{
                id: hashids.encode(0),
                title: 'Title',
                location: 'location',
                tags: ['tag'],
                occurrences: [{ start: '2018-07-14T12:00' }]
              }]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{
            slug: 'city',
            events: [{
              id: hashids.encode(0),
              title: 'Title',
              occurrences: [{ start: '2018-07-14T12:00' }],
              artist: null,
              location: { name: 'Location' },
              tags: [{ title: 'Tag' }],
              reservationPage: null
            }]
          }] } }
        )
      })

      // @todo Test adding an event to an unexisting city

      it("doesn't add event with unexisting artist", async function () {
        const { checkRequest, checkData } = await make({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', events: [] }] } })

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 40 }],
              message: 'No artist with slug "artist"',
              path: ['putEvent']
            }]
          }
        )

        await checkData({
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', events: [] }] } })
      })

      it("doesn't add event with unexisting location", async function () {
        const { checkRequest, checkData } = await make({
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', events: [] }] } })

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 40 }],
              message: 'No location with slug "location" in city with slug "city"',
              path: ['putEvent']
            }]
          }
        )

        await checkData({
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', events: [] }] } })
      })

      it("doesn't add event with unexisting tag", async function () {
        const { checkRequest, checkData } = await make({
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } }
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', events: [] }] } })

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T12:00' }]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{ line: 1, column: 40 }],
              message: 'No tag with slug "tag" in city with slug "city"',
              path: ['putEvent']
            }]
          }
        )

        await checkData({
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } }
            }
          }
        })

        await checkRequest(get, { data: { cities: [{ slug: 'city', events: [] }] } })
      })

      it('modifies an event', async function () {
        const { checkRequest, checkData } = await make({
          _: { sequences: { events: 12 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  id: 'otherEvent',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T11:00' }]
                },
                {
                  id: 'event',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{
            slug: 'city',
            events: [
              {
                id: 'otherEvent',
                title: null,
                occurrences: [{ start: '2018-07-14T11:00' }],
                artist: null,
                location: { name: 'Location' },
                tags: [{ title: 'Tag' }],
                reservationPage: null
              },
              {
                id: 'event',
                title: null,
                occurrences: [{ start: '2018-07-14T12:00' }],
                artist: null,
                location: { name: 'Location' },
                tags: [{ title: 'Tag' }],
                reservationPage: null
              }
            ]
          }] } }
        )

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              id: 'event',
              title: 'Title',
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T13:00' }],
              reservationPage: 'http://reserve.com/'
            }
          },
          { data: { putEvent: {
            id: 'event',
            title: 'Title',
            artist: { name: 'Artist' },
            location: { name: 'Location' },
            tags: [{ title: 'Tag' }],
            occurrences: [{ start: '2018-07-14T13:00' }],
            reservationPage: 'http://reserve.com/'
          } } }
        )

        await checkData({
          _: { sequences: { events: 12 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  id: 'otherEvent',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T11:00' }]
                },
                {
                  id: 'event',
                  location: 'location',
                  artist: 'artist',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T13:00' }],
                  title: 'Title',
                  reservationPage: 'http://reserve.com/'
                }
              ]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{
            slug: 'city',
            events: [
              {
                id: 'otherEvent',
                title: null,
                occurrences: [{ start: '2018-07-14T11:00' }],
                artist: null,
                location: { name: 'Location' },
                tags: [{ title: 'Tag' }],
                reservationPage: null
              },
              {
                id: 'event',
                title: 'Title',
                occurrences: [{ start: '2018-07-14T13:00' }],
                artist: { name: 'Artist' },
                location: { name: 'Location' },
                tags: [{ title: 'Tag' }],
                reservationPage: 'http://reserve.com/'
              }
            ]
          }] } }
        )
      })

      it("doesn't modify unexisting event", async function () {
        const { checkRequest, checkData } = await make({
          _: { sequences: { events: 12 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              id: 'event',
              title: 'Title',
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{ start: '2018-07-14T13:00' }]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{ line: 2, column: 3 }],
              message: 'No event with id "event" in city with slug "city"',
              path: ['putEvent']
            }]
          }
        )

        await checkData({
          _: { sequences: { events: 12 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }]
            }
          }
        })
      })
    })

    describe('deleteEvent', function () {
      const fields = 'id'
      const get = `{cities{slug events{${fields}}}}`
      const del = `mutation($citySlug:ID!,$eventId:ID!){deleteEvent(citySlug:$citySlug,eventId:$eventId){${fields}}}`

      it('deletes an event', async function () {
        const { checkRequest, checkData } = await make({
          _: { sequences: { events: 12 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  id: 'otherEvent',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T11:00' }]
                },
                {
                  id: 'event',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T12:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{ slug: 'city', events: [{ id: 'otherEvent' }, { id: 'event' }] }] } }
        )

        await checkRequest(
          del,
          {
            citySlug: 'city',
            eventId: 'event'
          },
          { data: { deleteEvent: { id: 'event' } } }
        )

        await checkData({
          _: { sequences: { events: 12 } },
          artists: { 'artist': { name: 'Artist' } },
          cities: {
            'city': {
              name: 'City',
              locations: { 'location': { name: 'Location' } },
              tags: [{ slug: 'tag', title: 'Tag' }],
              events: [
                {
                  id: 'otherEvent',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{ start: '2018-07-14T11:00' }]
                }
              ]
            }
          }
        })

        await checkRequest(
          get,
          { data: { cities: [{ slug: 'city', events: [{ id: 'otherEvent' }] }] } }
        )
      })

      // @todo Test deleting an event from an unexisting city

      it("doesn't delete an unexisting event", async function () {
        const { checkRequest, checkData } = await make({
          cities: { 'city': { 'name': 'City' } }
        })

        await checkRequest(
          del,
          {
            citySlug: 'city',
            eventId: 'event'
          },
          {
            data: null,
            errors: [{
              locations: [{ line: 2, column: 3 }],
              message: 'No event with id "event" in city with slug "city"',
              path: ['deleteEvent']
            }]
          }
        )

        await checkData({
          cities: {
            'city': { name: 'City' }
          }
        })
      })
    })

    it('adds artist, location and event in a single call', async function () {
      const { checkRequest, checkData } = await make({
        cities: { 'city': {
          name: 'City',
          tags: [{ slug: 'tag', title: 'Tag' }]
        } }
      })

      await checkRequest(
        'mutation{' +
          'putArtist(artist:{slug:"artist",name:"Artist",description:["Some artist"],website:"http://artist.bar"}){slug name description website}' +
          'putLocation(citySlug:"city",location:{slug:"location",name:"Location",description:["Some location"],website:"http://location.bar",phone:"0123456789",address:["Address"]}){slug name description website phone address}' +
          'putEvent(citySlug:"city",event:{location:"location",artist:"artist",tags:["tag"],occurrences:[{start:"2018-07-14T12:00"}]}){id artist{slug name description website} location{slug name description website phone address} tags{slug title}}' +
        '}',
        { data: {
          putArtist: { slug: 'artist', name: 'Artist', description: ['Some artist'], website: 'http://artist.bar' },
          putLocation: { slug: 'location', name: 'Location', description: ['Some location'], website: 'http://location.bar', phone: '0123456789', address: ['Address'] },
          putEvent: {
            id: hashids.encode(0),
            artist: { slug: 'artist', name: 'Artist', description: ['Some artist'], website: 'http://artist.bar' },
            location: { slug: 'location', name: 'Location', description: ['Some location'], website: 'http://location.bar', phone: '0123456789', address: ['Address'] },
            tags: [{ slug: 'tag', title: 'Tag' }]
          }
        } }
      )

      await checkData({
        _: {
          sequences: {
            events: 1
          }
        },
        artists: { artist: { name: 'Artist', description: ['Some artist'], website: 'http://artist.bar' } },
        cities: { 'city': {
          name: 'City',
          locations: { 'location': { name: 'Location', description: ['Some location'], website: 'http://location.bar', phone: '0123456789', address: ['Address'] } },
          events: [{
            id: hashids.encode(0),
            artist: 'artist',
            location: 'location',
            tags: ['tag'],
            occurrences: [{ start: '2018-07-14T12:00' }]
          }],
          tags: [{ slug: 'tag', title: 'Tag' }]
        } }
      })
    })
  })
})
