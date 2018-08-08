'use strict'

/* globals describe, it */

require('stringify').registerWithRequire(['.gqls'])

const assert = require('assert') // Not strict because graphql's returned data doesn't have Object prototype
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

  describe('city.dates', function () {
    const get = '{cities{slug firstDate dateAfter}}'

    it('returns dates', async function () {
      const {checkRequest} = make({
        artists: {},
        cities: {
          'no-events': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: {'tag': {title: 'Tag'}},
            events: []
          },
          'single-occurrence': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: {'tag': {title: 'Tag'}},
            events: [{
              location: 'location',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }]
          },
          'several-occurrences': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: {'tag': {title: 'Tag'}},
            events: [{
              location: 'location',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}, {start: '2018-07-13T12:00'}, {start: '2018-07-15T12:00'}]
            }]
          },
          'several-events': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: {'tag': {title: 'Tag'}},
            events: [
              {
                location: 'location',
                tags: ['tag'],
                occurrences: [{start: '2018-07-14T12:00'}]
              },
              {
                location: 'location',
                tags: ['tag'],
                occurrences: [{start: '2018-07-13T12:00'}]
              },
              {
                location: 'location',
                tags: ['tag'],
                occurrences: [{start: '2018-07-15T12:00'}]
              }
            ]
          }
        }
      })

      await checkRequest(
        get,
        {data: {cities: [
          {slug: 'no-events', firstDate: null, dateAfter: null},
          {slug: 'single-occurrence', firstDate: '2018-07-14', dateAfter: '2018-07-15'},
          {slug: 'several-occurrences', firstDate: '2018-07-13', dateAfter: '2018-07-16'},
          {slug: 'several-events', firstDate: '2018-07-13', dateAfter: '2018-07-16'}
        ]}}
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
      it('filters by tag', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}, 'other-tag': {title: 'Other tag'}},
              events: [
                {
                  id: 'ok-single',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: 'ok-main',
                  location: 'location',
                  tags: ['tag', 'other-tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: 'ok-secondary',
                  location: 'location',
                  tags: ['other-tag', 'tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: 'ko',
                  location: 'location',
                  tags: ['other-tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(tag:"tag"){id}}}',
          {data: {cities: [{events: [{id: 'ok-single'}, {id: 'ok-main'}, {id: 'ok-secondary'}]}]}}
        )
      })

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

      it('filters by title', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  title: 'title aeiou',
                  id: 'ok-literal',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  title: 'aeiou title',
                  id: 'ok-reversed',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  title: 'TITLE AEIOU',
                  id: 'ok-uppercase',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  title: 'title àéïôù',
                  id: 'ok-accentuated',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: 'ko-no-title',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  title: 'title',
                  id: 'ko-not-all-words',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  title: 'foobar',
                  id: 'ko-title-no-match',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(title:"title aeiou"){id}}}',
          {data: {cities: [{events: [{id: 'ok-literal'}, {id: 'ok-reversed'}, {id: 'ok-uppercase'}, {id: 'ok-accentuated'}]}]}}
        )
      })

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

      it('limits events returned', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  id: '1',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: '2',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: '3',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  id: '4',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          '{cities{events(max:2){id}}}',
          {data: {cities: [{events: null}]}}
        )

        await checkRequest(
          '{cities{events(max:3){id}}}',
          {data: {cities: [{events: null}]}}
        )

        await checkRequest(
          '{cities{events(max:4){id}}}',
          {data: {cities: [{events: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}]}]}}
        )

        await checkRequest(
          '{cities{events(max:25){id}}}',
          {data: {cities: [{events: [{id: '1'}, {id: '2'}, {id: '3'}, {id: '4'}]}]}}
        )
      })
    })

    describe('city.event', function () {
      it('find event by id', async function () {
        const {checkRequest} = make({
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [{
                id: 'event',
                location: 'location',
                tags: ['tag'],
                occurrences: [{start: '2018-07-13T23:59'}]
              }]
            }
          }
        })

        await checkRequest(
          '{cities{event(id:"event"){id}}}',
          {data: {cities: [{event: {id: 'event'}}]}}
        )
      })

      it("doesn't find event by id", async function () {
        const {checkRequest} = make({
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
          '{cities{event(id:"event"){id}}}',
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 9}],
              message: 'No event with id "event"',
              path: ['cities', 0, 'event']
            }]
          }
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

    describe('putEvent', function () {
      const fields = 'id title artist{name} location{name} tags{title} occurrences{start}'
      const get = `{cities{slug events{${fields}}}}`
      const put = `mutation($event:IEvent!){putEvent(event:$event){${fields}}}`

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
          {data: {putEvent: {
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
          {data: {putEvent: {
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
          {data: {putEvent: {
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
              path: ['putEvent']
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
              path: ['putEvent']
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
              path: ['putEvent']
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

      it('modifies an event', async function () {
        const {checkRequest, checkData} = make({
          _: {sequences: {events: 12}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  id: 'other-event',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T11:00'}]
                },
                {
                  id: 'event',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{
            slug: 'city',
            events: [
              {
                id: 'other-event',
                title: null,
                occurrences: [{start: '2018-07-14T11:00'}],
                artist: null,
                location: {name: 'Location'},
                tags: [{title: 'Tag'}]
              },
              {
                id: 'event',
                title: null,
                occurrences: [{start: '2018-07-14T12:00'}],
                artist: null,
                location: {name: 'Location'},
                tags: [{title: 'Tag'}]
              }
            ]
          }]}}
        )

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            eventId: 'event',
            title: 'Title',
            location: 'location',
            artist: 'artist',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T13:00'}]
          }},
          {data: {putEvent: {
            id: 'event',
            title: 'Title',
            artist: {name: 'Artist'},
            location: {name: 'Location'},
            tags: [{title: 'Tag'}],
            occurrences: [{start: '2018-07-14T13:00'}]
          }}}
        )

        checkData({
          _: {sequences: {events: 12}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: [
                {
                  id: 'other-event',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T11:00'}]
                },
                {
                  id: 'event',
                  location: 'location',
                  artist: 'artist',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T13:00'}],
                  title: 'Title'
                }
              ]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{
            slug: 'city',
            events: [
              {
                id: 'other-event',
                title: null,
                occurrences: [{start: '2018-07-14T11:00'}],
                artist: null,
                location: {name: 'Location'},
                tags: [{title: 'Tag'}]
              },
              {
                id: 'event',
                title: 'Title',
                occurrences: [{start: '2018-07-14T13:00'}],
                artist: {name: 'Artist'},
                location: {name: 'Location'},
                tags: [{title: 'Tag'}]
              }
            ]
          }]}}
        )
      })

      it("doesn't modify unexisting event", async function () {
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

        await checkRequest(
          put,
          {event: {
            citySlug: 'city',
            eventId: 'event',
            title: 'Title',
            location: 'location',
            artist: 'artist',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T13:00'}]
          }},
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 26}],
              message: 'No event with id "event"',
              path: ['putEvent']
            }]
          }
        )

        checkData({
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
          'putEvent(event:{citySlug:"city",location:"location",artist:"artist",tags:["tag"],occurrences:[{start:"2018-07-14T12:00"}]}){id artist{slug name} location{slug name} tags{slug title}}' +
        '}',
        {data: {
          putArtist: {slug: 'artist', name: 'Artist'},
          putLocation: {slug: 'location', name: 'Location'},
          putEvent: {
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
