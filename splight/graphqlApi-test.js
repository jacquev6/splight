'use strict'

/* globals describe, it */

require('stringify').registerWithRequire(['.gqls'])

const assert = require('assert') // Not strict because graphql's returned data doesn't have Object prototype
const deepcopy = require('deepcopy')
const graphql = require('graphql')
const Hashids = require('hashids')

const graphqlApi = require('./graphqlApi')

const hashids = new Hashids('', 10)

describe('graphqlApi', function () {
  describe('make', function () {
    it('works', async function () {
      var data = {artists: {}, cities: {}}
      const {request} = graphqlApi.make({
        load: async () => data,
        save: async d => { data = d }
      })

      assert.deepEqual(
        await request({requestString: '{cities{slug}}'}),
        {data: {cities: []}}
      )
    })
  })

  describe('makeRoot', function () {
    it('computes first event id', function () {
      const data = {
        artists: {'artist': {name: 'Artist'}},
        cities: {'city': {
          name: 'City',
          locations: {'location': {name: 'Location'}},
          tags: {'tag': {title: 'Tag'}},
          events: [{
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [
              {start: '2018-07-12T12:00'}
            ]
          }]
        }}
      }

      graphqlApi.forTest.makeRoot(data)

      assert.deepStrictEqual(
        data,
        {
          _: {sequences: {events: 1}},
          artists: {'artist': {name: 'Artist'}},
          cities: {'city': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: {'tag': {title: 'Tag'}},
            events: [{
              id: hashids.encode(0),
              location: 'location',
              tags: ['tag'],
              title: 'Title',
              occurrences: [
                {start: '2018-07-12T12:00'}
              ]
            }]
          }}
        }
      )
    })

    it('computes next event id', function () {
      const data = {
        _: {sequences: {events: 10}},
        artists: {'artist': {name: 'Artist'}},
        cities: {'city': {
          name: 'City',
          locations: {'location': {name: 'Location'}},
          tags: {'tag': {title: 'Tag'}},
          events: [{
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [
              {start: '2018-07-12T12:00'}
            ]
          }]
        }}
      }

      graphqlApi.forTest.makeRoot(data)

      assert.deepStrictEqual(
        data,
        {
          _: {sequences: {events: 11}},
          artists: {'artist': {name: 'Artist'}},
          cities: {'city': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: {'tag': {title: 'Tag'}},
            events: [{
              id: hashids.encode(10),
              location: 'location',
              tags: ['tag'],
              title: 'Title',
              occurrences: [
                {start: '2018-07-12T12:00'}
              ]
            }]
          }}
        }
      )
    })

    it("doesn't touch existing event ids", function () {
      const data = {
        _: {sequences: {events: 10}},
        artists: {'artist': {name: 'Artist'}},
        cities: {'city': {
          name: 'City',
          locations: {'location': {name: 'Location'}},
          tags: {'tag': {title: 'Tag'}},
          events: [{
            id: 'foobarbaz',
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [
              {start: '2018-07-12T12:00'}
            ]
          }]
        }}
      }

      graphqlApi.forTest.makeRoot(data)

      assert.deepStrictEqual(
        data,
        {
          _: {sequences: {events: 10}},
          artists: {'artist': {name: 'Artist'}},
          cities: {'city': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: {'tag': {title: 'Tag'}},
            events: [{
              id: 'foobarbaz',
              location: 'location',
              tags: ['tag'],
              title: 'Title',
              occurrences: [
                {start: '2018-07-12T12:00'}
              ]
            }]
          }}
        }
      )
    })
  })

  describe('queries', function () {
    function test (data, requestString, expected) {
      const rootValue = graphqlApi.forTest.makeRoot(deepcopy(data))

      return async function () {
        assert.deepEqual(
          await graphql.graphql(graphqlApi.forTest.schema, requestString, rootValue),
          expected
        )
      }
    }

    const emptyData = {
      artists: {},
      cities: {}
    }

    const emptyCitiesData = {
      artists: {},
      cities: {
        'foo': {
          name: 'Foo',
          locations: {},
          tags: {},
          events: []
        },
        'baz': {
          name: 'Baz',
          locations: {},
          tags: {},
          events: []
        },
        'bar': {
          name: 'Bar',
          locations: {},
          tags: {},
          events: []
        }
      }
    }

    const fullCityData = {
      artists: {
        'artist-1': {name: 'Artist 1'},
        'artist-3': {name: 'Artist 3'},
        'artist-2': {name: 'Artist 2'}
      },
      cities: {'foo': {
        name: 'Foo',
        locations: {
          'location-1': {name: 'Location 1'},
          'location-3': {name: 'Location 3'},
          'location-2': {name: 'Location 2'}
        },
        tags: {
          'tag-1': {title: 'Tag 1'},
          'tag-3': {title: 'Tag 3'},
          'tag-2': {title: 'Tag 2'}
        },
        events: [
          {
            location: 'location-2',
            tags: ['tag-1', 'tag-3'],
            title: 'Title 1',
            occurrences: [
              {start: '2018-07-12T12:00'},
              {start: '2018-07-15T13:00'}
            ]
          },
          {
            location: 'location-1',
            artist: 'artist-2',
            tags: ['tag-3', 'tag-2'],
            title: 'Title 2',
            occurrences: [
              {start: '2018-07-12T11:00'},
              {start: '2018-07-14T19:00'}
            ]
          },
          {
            location: 'location-3',
            artist: 'artist-1',
            tags: ['tag-2'],
            occurrences: [
              {start: '2018-07-13T19:00'}
            ]
          }
        ]
      }}
    }

    describe('artists', function () {
      it('has no artist to return', test(emptyData, '{artists{slug}}', {data: {artists: []}}))

      it('returns artists', test(fullCityData, '{artists{slug}}', {data: {artists: [{slug: 'artist-1'}, {slug: 'artist-3'}, {slug: 'artist-2'}]}}))

      it('returns artists names', test(fullCityData, '{artists{slug name}}', {data: {artists: [
        {slug: 'artist-1', name: 'Artist 1'},
        {slug: 'artist-3', name: 'Artist 3'},
        {slug: 'artist-2', name: 'Artist 2'}
      ]}}))
    })

    describe('cities', function () {
      it('has no city to return', test(emptyData, '{cities{slug}}', {data: {cities: []}}))

      it('returns cities', test(emptyCitiesData, '{cities{slug}}', {data: {cities: [{slug: 'foo'}, {slug: 'baz'}, {slug: 'bar'}]}}))

      it('returns cities names', test(emptyCitiesData, '{cities{slug name}}', {data: {cities: [
        {slug: 'foo', name: 'Foo'},
        {slug: 'baz', name: 'Baz'},
        {slug: 'bar', name: 'Bar'}
      ]}}))
    })

    describe('city', function () {
      it('has no city to return', test(emptyData, '{city(slug:"foo"){slug}}', {
        data: null,
        errors: [{
          locations: [{column: 2, line: 1}],
          message: 'No city with slug "foo"',
          path: ['city']
        }]
      }))

      it('finds city foo', test(emptyCitiesData, '{city(slug:"foo"){slug}}', {data: {city: {slug: 'foo'}}}))

      it('finds city bar', test(emptyCitiesData, '{city(slug:"bar"){slug}}', {data: {city: {slug: 'bar'}}}))

      it('finds city baz', test(emptyCitiesData, '{city(slug:"baz"){slug}}', {data: {city: {slug: 'baz'}}}))

      it('finds no city', test(emptyCitiesData, '{city(slug:"toto"){slug}}', {
        data: null,
        errors: [{
          locations: [{column: 2, line: 1}],
          message: 'No city with slug "toto"',
          path: ['city']
        }]
      }))

      it('returns no dates', test(emptyCitiesData, '{city(slug:"foo"){firstDate dateAfter}}', {
        data: {city: {firstDate: null, dateAfter: null}}
      }))
    })

    describe('cities (with full data)', function () {
      it('returns tags', test(fullCityData, '{cities{tags{slug title}}}', {data: {cities: [{tags: [
        {slug: 'tag-1', title: 'Tag 1'},
        {slug: 'tag-3', title: 'Tag 3'},
        {slug: 'tag-2', title: 'Tag 2'}
      ]}]}}))

      it('returns locations', test(fullCityData, '{cities{locations{slug name}}}', {data: {cities: [{locations: [
        {slug: 'location-1', name: 'Location 1'},
        {slug: 'location-3', name: 'Location 3'},
        {slug: 'location-2', name: 'Location 2'}
      ]}]}}))

      it('returns dates', test(fullCityData, '{cities{firstDate dateAfter}}', {data: {cities: [{
        firstDate: '2018-07-12', dateAfter: '2018-07-16'
      }]}}))
    })
  })

  function make (data) {
    const rootValue = graphqlApi.forTest.makeRoot(data)

    async function checkRequest (requestString, variableValues, expected) {
      if (!expected) { // A poor man's variadic function
        expected = variableValues
        variableValues = undefined
      }
      assert.deepEqual(
        await graphql.graphql(graphqlApi.forTest.schema, requestString, rootValue, undefined, variableValues),
        expected
      )
    }

    function checkData (expected) {
      assert.deepStrictEqual(data, expected)
    }

    return {checkRequest, checkData}
  }

  describe('full query', function () {
    const get = `{
      artists{slug name}
      cities{
        slug
        name
        tags{slug title}
        locations{slug name}
        events{
          id
          title
          artist{slug name}
          location{slug name}
          tags{slug title}
          occurrences{start}
        }
        firstDate
        dateAfter
      }
    }`

    it('returns everything on single city without events', async function () {
      const {checkRequest} = make({
        artists: {
          'artist-1': {name: 'Artist 1'},
          'artist-2': {name: 'Artist 2'}
        },
        cities: {
          'city': {
            name: 'City',
            locations: {
              'location-1': {name: 'Location 1'},
              'location-2': {name: 'Location 2'}
            },
            tags: {
              'tag-1': {title: 'Tag 1'},
              'tag-2': {title: 'Tag 2'}
            },
            events: []
          }
        }
      })

      await checkRequest(
        get,
        {data: {
          artists: [
            {slug: 'artist-1', name: 'Artist 1'},
            {slug: 'artist-2', name: 'Artist 2'}
          ],
          cities: [{
            slug: 'city',
            name: 'City',
            tags: [
              {slug: 'tag-1', title: 'Tag 1'},
              {slug: 'tag-2', title: 'Tag 2'}
            ],
            locations: [
              {slug: 'location-1', name: 'Location 1'},
              {slug: 'location-2', name: 'Location 2'}
            ],
            events: [],
            firstDate: null,
            dateAfter: null
          }]
        }}
      )
    })

    it('returns everything on single city with single minimal event', async function () {
      const {checkRequest} = make({
        artists: {
          'artist-1': {name: 'Artist 1'},
          'artist-2': {name: 'Artist 2'}
        },
        cities: {
          'city': {
            name: 'City',
            locations: {
              'location-1': {name: 'Location 1'},
              'location-2': {name: 'Location 2'}
            },
            tags: {
              'tag-1': {title: 'Tag 1'},
              'tag-2': {title: 'Tag 2'}
            },
            events: [{
              location: 'location-1',
              tags: ['tag-1'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }]
          }
        }
      })

      await checkRequest(
        get,
        {data: {
          artists: [
            {slug: 'artist-1', name: 'Artist 1'},
            {slug: 'artist-2', name: 'Artist 2'}
          ],
          cities: [{
            slug: 'city',
            name: 'City',
            tags: [
              {slug: 'tag-1', title: 'Tag 1'},
              {slug: 'tag-2', title: 'Tag 2'}
            ],
            locations: [
              {slug: 'location-1', name: 'Location 1'},
              {slug: 'location-2', name: 'Location 2'}
            ],
            events: [{
              id: hashids.encode(0),
              artist: null,
              title: null,
              location: {slug: 'location-1', name: 'Location 1'},
              tags: [{slug: 'tag-1', title: 'Tag 1'}],
              occurrences: [{start: '2018-07-14T12:00'}]
            }],
            firstDate: '2018-07-14',
            dateAfter: '2018-07-15'
          }]
        }}
      )
    })
  })

  describe('filtering queries', function () {
    describe('city', function () {
      const get = 'query($slug:ID!){city(slug:$slug){name}}'

      it("doesn't find city", async function () {
        const {checkRequest} = make({artists: {}, cities: {}})

        await checkRequest(
          get,
          {slug: 'foo'},
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 18}],
              message: 'No city with slug "foo"',
              path: ['city']
            }]
          }
        )
      })

      it('finds cities', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city-1': {name: 'City 1', locations: {}, tags: {}, events: []},
            'city-2': {name: 'City 2', locations: {}, tags: {}, events: []},
            'city-3': {name: 'City 3', locations: {}, tags: {}, events: []}
          }
        })

        await checkRequest(get, {slug: 'city-1'}, {data: {city: {name: 'City 1'}}})
        await checkRequest(get, {slug: 'city-2'}, {data: {city: {name: 'City 2'}}})
        await checkRequest(get, {slug: 'city-3'}, {data: {city: {name: 'City 3'}}})
      })
    })

    describe('city.events', function () {
      it('filters by location', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}, 'other-location': {name: 'Other location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  id: 'ok',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: 'ko-other-location',
                  location: 'other-location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(location:"location"){id}}}',
          {data: {cities: [{events: [{id: 'ok'}]}]}}
        )
      })

      it('filters by artist', async function () {
        const {checkRequest} = make({
          artists: {'artist': {name: 'Artist'}, 'artist-2': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  id: 'ok',
                  artist: 'artist',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: 'ko-other-artist',
                  artist: 'artist-2',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: 'ko-no-artist',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(artist:"artist"){id}}}',
          {data: {cities: [{events: [{id: 'ok'}]}]}}
        )
      })

      it('filters by title') // @todo Implement

      it('filters by dates', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  id: 'ko-before',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-13T23:59'}]
                },
                {
                  id: 'ok-1',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-12T12:00'}, {start: '2018-07-14T00:00'}, {start: '2018-07-16T12:00'}]
                },
                {
                  id: 'ok-2',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-15T23:59'}]
                },
                {
                  id: 'ko-after',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-16T00:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(dates:{start:"2018-07-14", after:"2018-07-16"}){id}}}',
          {data: {cities: [{events: [{id: 'ok-1'}, {id: 'ok-2'}]}]}}
        )
      })
    })
  })

  describe('mutations', function () {
    describe('putArtist', function () {
      const fields = 'slug name'
      const get = `{artists{${fields}}}`
      const put = `mutation($artist:IArtist!){putArtist(artist:$artist){${fields}}}`

      it('adds an artist', async function () {
        const {checkRequest, checkData} = make({artists: {}, cities: {}})

        await checkRequest(get, {data: {artists: []}})

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'Artist'}},
          {data: {putArtist: {slug: 'artist', name: 'Artist'}}}
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {'artist': {name: 'Artist'}},
          cities: {}
        })

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'Artist'}]}})
      })

      it('modifies an artist', async function () {
        const {checkRequest, checkData} = make({artists: {'artist': {name: 'Artist'}}, cities: {}})

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'Artist'}]}})

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'New name'}},
          {data: {putArtist: {slug: 'artist', name: 'New name'}}}
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {'artist': {name: 'New name'}},
          cities: {}
        })

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'New name'}]}})
      })

      it('propagates changes to events', async function () {
        const {checkRequest} = make({
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [{
                artist: 'artist',
                location: 'location',
                tags: ['tag'],
                occurrences: [{start: '2018-07-14T12:00'}]
              }]
            }
          }
        })

        const getEvents = `{cities{events{artist{${fields}}}}}`

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{artist: {slug: 'artist', name: 'Artist'}}]}]}}
        )

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'New name'}},
          {data: {putArtist: {slug: 'artist', name: 'New name'}}}
        )

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{artist: {slug: 'artist', name: 'New name'}}]}]}}
        )
      })
    })

    describe('putLocation', function () {
      const fields = 'slug name'
      const get = `{cities{slug locations{${fields}}}}`
      const put = `mutation($location:ILocation!){putLocation(location:$location){${fields}}}`

      it('adds a location', async function () {
        const {checkRequest, checkData} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {},
              tags: {},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', locations: []}]}})

        await checkRequest(
          put,
          {location: {citySlug: 'city', slug: 'location', name: 'Location'}},
          {data: {putLocation: {slug: 'location', name: 'Location'}}}
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', locations: [{slug: 'location', name: 'Location'}]}]}})
      })

      it('modifies a location', async function () {
        const {checkRequest, checkData} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', locations: [{slug: 'location', name: 'Location'}]}]}})

        await checkRequest(
          put,
          {location: {citySlug: 'city', slug: 'location', name: 'New name'}},
          {data: {putLocation: {slug: 'location', name: 'New name'}}}
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'New name'}},
              tags: {},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', locations: [{slug: 'location', name: 'New name'}]}]}})
      })

      it('propagates changes to events', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [
                    {start: '2018-07-14T12:00'}
                  ]
                }
              ]
            }
          }
        })

        const getEvents = `{cities{events{location{${fields}}}}}`

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{location: {slug: 'location', name: 'Location'}}]}]}}
        )

        await checkRequest(
          put,
          {location: {citySlug: 'city', slug: 'location', name: 'New name'}},
          {data: {putLocation: {slug: 'location', name: 'New name'}}}
        )

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{location: {slug: 'location', name: 'New name'}}]}]}}
        )
      })
    })

    describe('addEvent', function () {
      const fields = 'id title artist{name} location{name} tags{title} occurrences{start}'
      const get = `{cities{slug events{${fields}}}}`
      const put = `mutation($event:IEvent!){addEvent(event:$event){${fields}}}`

      it('adds an event', async function () {
        const {checkRequest, checkData} = make({
          _: {sequences: {events: 12}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            title: 'Title',
            location: 'location',
            artist: 'artist',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }},
          {data: {addEvent: {
            id: hashids.encode(12),
            title: 'Title',
            artist: {name: 'Artist'},
            location: {name: 'Location'},
            tags: [{title: 'Tag'}],
            occurrences: [{start: '2018-07-14T12:00'}]
          }}}
        )

        checkData({
          _: {sequences: {events: 13}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [{
                id: hashids.encode(12),
                location: 'location',
                artist: 'artist',
                tags: ['tag'],
                occurrences: [
                  {start: '2018-07-14T12:00'}
                ],
                title: 'Title'
              }]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{
            slug: 'city',
            events: [{
              id: hashids.encode(12),
              title: 'Title',
              occurrences: [{start: '2018-07-14T12:00'}],
              artist: {name: 'Artist'},
              location: {name: 'Location'},
              tags: [{title: 'Tag'}]
            }]
          }]}}
        )
      })

      it('adds an event without title', async function () {
        const {checkRequest, checkData} = make({
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{slug: 'city', events: []}]}}
        )

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            location: 'location',
            artist: 'artist',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }},
          {data: {addEvent: {
            id: hashids.encode(0),
            title: null,
            artist: {name: 'Artist'},
            location: {name: 'Location'},
            tags: [{title: 'Tag'}],
            occurrences: [{start: '2018-07-14T12:00'}]
          }}}
        )

        checkData({
          _: {sequences: {events: 1}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [{
                id: hashids.encode(0),
                location: 'location',
                artist: 'artist',
                tags: ['tag'],
                occurrences: [{start: '2018-07-14T12:00'}]
              }]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{
            slug: 'city',
            events: [{
              id: hashids.encode(0),
              title: null,
              occurrences: [{start: '2018-07-14T12:00'}],
              artist: {name: 'Artist'},
              location: {name: 'Location'},
              tags: [{title: 'Tag'}]
            }]
          }]}}
        )
      })

      it('adds an event without artist', async function () {
        const {checkRequest, checkData} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{slug: 'city', events: []}]}}
        )

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            title: 'Title',
            location: 'location',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }},
          {data: {addEvent: {
            id: hashids.encode(0),
            title: 'Title',
            artist: null,
            location: {name: 'Location'},
            tags: [{title: 'Tag'}],
            occurrences: [{start: '2018-07-14T12:00'}]
          }}}
        )

        checkData({
          _: {sequences: {events: 1}},
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [{
                id: hashids.encode(0),
                title: 'Title',
                location: 'location',
                tags: ['tag'],
                occurrences: [
                  {start: '2018-07-14T12:00'}
                ]
              }]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{
            slug: 'city',
            events: [{
              id: hashids.encode(0),
              title: 'Title',
              occurrences: [{start: '2018-07-14T12:00'}],
              artist: null,
              location: {name: 'Location'},
              tags: [{title: 'Tag'}]
            }]
          }]}}
        )
      })

      it("doesn't add event with unexisting artist", async function () {
        const {checkRequest, checkData} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            location: 'location',
            artist: 'artist',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }},
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 26}],
              message: 'No artist with slug "artist"',
              path: ['addEvent']
            }]
          }
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})
      })

      it("doesn't add event with unexisting location", async function () {
        const {checkRequest, checkData} = make({
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            location: 'location',
            artist: 'artist',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }},
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 26}],
              message: 'No location with slug "location"',
              path: ['addEvent']
            }]
          }
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})
      })

      it("doesn't add event with unexisting tag", async function () {
        const {checkRequest, checkData} = make({
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            location: 'location',
            artist: 'artist',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }},
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 26}],
              message: 'No tag with slug "tag"',
              path: ['addEvent']
            }]
          }
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {},
              events: []
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})
      })
    })

    it('adds artist, location and event in a single call', async function () {
      const {checkRequest, checkData} = make({
        artists: {},
        cities: {'city': {
          name: 'City',
          locations: {},
          events: [],
          tags: {'tag': {title: 'Tag'}}
        }}
      })

      await checkRequest(
        'mutation{' +
          'putArtist(artist:{slug:"artist",name:"Artist"}){slug name}' +
          'putLocation(location:{citySlug:"city",slug:"location",name:"Location"}){slug name}' +
          'addEvent(event:{citySlug:"city",location:"location",artist:"artist",tags:["tag"],occurrences:[{start:"2018-07-14T12:00"}]}){id artist{slug name} location{slug name} tags{slug title}}' +
        '}',
        {data: {
          putArtist: {slug: 'artist', name: 'Artist'},
          putLocation: {slug: 'location', name: 'Location'},
          addEvent: {
            id: hashids.encode(0),
            artist: {slug: 'artist', name: 'Artist'},
            location: {slug: 'location', name: 'Location'},
            tags: [{slug: 'tag', title: 'Tag'}]
          }
        }}
      )

      checkData({
        _: {
          sequences: {
            events: 1
          }
        },
        artists: {artist: {name: 'Artist'}},
        cities: {'city': {
          name: 'City',
          locations: {'location': {name: 'Location'}},
          events: [{
            id: hashids.encode(0),
            artist: 'artist',
            location: 'location',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }],
          tags: {'tag': {title: 'Tag'}}
        }}
      })
    })
  })
})
