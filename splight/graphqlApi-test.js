'use strict'

/* globals describe, it */

require('stringify').registerWithRequire(['.gqls'])

const assert = require('assert') // Not strict because graphql's returned data doesn't have Object prototype
const deepcopy = require('deepcopy')

const graphqlApi = require('./graphqlApi')

describe('graphqlApi', function () {
  describe('queries', function () {
    function test (data, requestString, expected) {
      return async function () {
        assert.deepEqual(
          await graphqlApi.make({load: () => deepcopy(data), save: () => undefined}).request({requestString}),
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
            occurences: [
              {start: '2018-07-12T12:00'},
              {start: '2018-07-15T13:00'}
            ]
          },
          {
            location: 'location-1',
            artist: 'artist-2',
            tags: ['tag-3', 'tag-2'],
            title: 'Title 2',
            occurences: [
              {start: '2018-07-12T11:00'},
              {start: '2018-07-14T19:00'}
            ]
          },
          {
            location: 'location-3',
            artist: 'artist-1',
            tags: ['tag-2'],
            occurences: [
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
        data: {city: null},
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
        data: {city: null},
        errors: [{
          locations: [{column: 2, line: 1}],
          message: 'No city with slug "toto"',
          path: ['city']
        }]
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

      it('returns days', test(fullCityData, '{cities{days(first:"2018-07-01", after:"2018-07-04"){date}}}', {data: {cities: [{days: [
        {date: '2018-07-01'},
        {date: '2018-07-02'},
        {date: '2018-07-03'}
      ]}]}}))

      it('returns events', test(fullCityData, '{cities{days(first:"2018-07-12", after:"2018-07-16"){date events{time title}}}}', {data: {cities: [{days: [
        {
          date: '2018-07-12',
          events: [
            {time: '11:00', title: 'Title 2'},
            {time: '12:00', title: 'Title 1'}
          ]
        },
        {
          date: '2018-07-13',
          events: [
            {time: '19:00', title: null}
          ]
        },
        {
          date: '2018-07-14',
          events: [
            {time: '19:00', title: 'Title 2'}
          ]
        },
        {
          date: '2018-07-15',
          events:
          [
            {time: '13:00', title: 'Title 1'}
          ]
        }
      ]}]}}))

      it('returns event location',
        test(
          fullCityData,
          '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{location{slug name}}}}}',
          {data: {cities: [{days: [{events: [{location: {slug: 'location-1', name: 'Location 1'}}]}]}]}}
        )
      )

      it('returns event artist',
        test(
          fullCityData,
          '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{artist{slug name}}}}}',
          {data: {cities: [{days: [{events: [{artist: {slug: 'artist-2', name: 'Artist 2'}}]}]}]}}
        )
      )

      it('returns null event artist',
        test(
          fullCityData,
          '{cities{days(first:"2018-07-15", after:"2018-07-16"){events{artist{slug name}}}}}',
          {data: {cities: [{days: [{events: [{artist: null}]}]}]}}
        )
      )

      it('returns event mainTag',
        test(
          fullCityData,
          '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{mainTag{slug title}}}}}',
          {data: {cities: [{days: [{events: [{mainTag: {slug: 'tag-3', title: 'Tag 3'}}]}]}]}}
        )
      )

      it('returns event tags',
        test(
          fullCityData,
          '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{tags{slug title}}}}}',
          {data: {cities: [{days: [{events: [{tags: [{slug: 'tag-3', title: 'Tag 3'}, {slug: 'tag-2', title: 'Tag 2'}]}]}]}]}}
        )
      )
    })
  })

  describe('mutations', function () {
    describe('putArtist', function () {
      it('adds an artist', async function () {
        const initialData = {
          artists: {},
          cities: {}
        }

        var newData = null

        // Test with and without promises
        const configs = [
          {load: () => deepcopy(initialData), save: d => { newData = d }},
          {load: async () => deepcopy(initialData), save: async d => { newData = d }}
        ]

        for (var config of configs) {
          const api = graphqlApi.make(config)

          function run (requestString) { // eslint-disable-line
            return api.request({requestString})
          }

          await assert.deepEqual(
            await run('{artists{slug}}'),
            {data: {artists: []}}
          )

          newData = null

          await assert.deepEqual(
            await run('mutation{putArtist(artist:{slug:"artist",name:"Artist"}){slug, name}}'),
            {data: {putArtist: {slug: 'artist', name: 'Artist'}}}
          )

          assert.deepEqual(
            newData,
            {
              artists: {artist: {name: 'Artist'}},
              cities: {}
            }
          )

          await assert.deepEqual(
            await run('{artists{slug}}'),
            {data: {artists: [{slug: 'artist'}]}}
          )
        }
      })

      it('modifies an artist', async function () {
        const initialData = {
          artists: {'artist': {name: 'Artist'}},
          cities: {}
        }

        var newData = null

        const api = graphqlApi.make({load: () => deepcopy(initialData), save: d => { newData = d }})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{artists{slug name}}'),
          {data: {artists: [{slug: 'artist', name: 'Artist'}]}}
        )

        await assert.deepEqual(
          await run('mutation{putArtist(artist:{slug:"artist",name:"New name"}){slug}}'),
          {data: {putArtist: {slug: 'artist'}}}
        )

        assert.deepEqual(
          newData,
          {
            artists: {'artist': {name: 'New name'}},
            cities: {}
          }
        )

        await assert.deepEqual(
          await run('{artists{slug name}}'),
          {data: {artists: [{slug: 'artist', name: 'New name'}]}}
        )
      })

      it('propagates changes to events', async function () {
        const initialData = {
          artists: {artist: {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {loc: {name: 'Location'}},
              tags: {},
              events: [
                {
                  artist: 'artist',
                  location: 'loc',
                  tags: [],
                  occurences: [
                    {start: '2018-07-14T12:00'}
                  ]
                }
              ]
            }
          }
        }

        const api = graphqlApi.make({load: () => initialData, save: () => undefined})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{days(first:"2018-07-14",after:"2018-07-15"){events{artist{slug name}}}}}'),
          {data: {cities: [{days: [{events: [{artist: {slug: 'artist', name: 'Artist'}}]}]}]}}
        )

        await assert.deepEqual(
          await run('mutation{putArtist(artist:{slug:"artist",name:"New name"}){slug}}'),
          {data: {putArtist: {slug: 'artist'}}}
        )

        await assert.deepEqual(
          await run('{cities{days(first:"2018-07-14",after:"2018-07-15"){events{artist{slug name}}}}}'),
          {data: {cities: [{days: [{events: [{artist: {slug: 'artist', name: 'New name'}}]}]}]}}
        )
      })
    })

    describe('putLocation', function () {
      it('adds a location', async function () {
        const initialData = {
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {},
              tags: {},
              events: []
            }
          }
        }

        var newData = null

        const api = graphqlApi.make({load: () => deepcopy(initialData), save: d => { newData = d }})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{slug locations{slug}}}'),
          {data: {cities: [{slug: 'city', locations: []}]}}
        )

        await assert.deepEqual(
          await run('mutation{putLocation(location:{citySlug:"city",slug:"loc",name:"Location"}){slug}}'),
          {data: {putLocation: {slug: 'loc'}}}
        )

        assert.deepEqual(
          newData,
          {
            artists: {},
            cities: {
              'city': {
                name: 'City',
                locations: {loc: {name: 'Location'}},
                tags: {},
                events: []
              }
            }
          }
        )

        await assert.deepEqual(
          await run('{cities{slug locations{slug}}}'),
          {data: {cities: [{slug: 'city', locations: [{slug: 'loc'}]}]}}
        )
      })

      it('modifies a location', async function () {
        const initialData = {
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {loc: {name: 'Location'}},
              tags: {},
              events: []
            }
          }
        }

        var newData = null

        const api = graphqlApi.make({load: () => deepcopy(initialData), save: d => { newData = d }})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{slug locations{slug name}}}'),
          {data: {cities: [{slug: 'city', locations: [{slug: 'loc', name: 'Location'}]}]}}
        )

        await assert.deepEqual(
          await run('mutation{putLocation(location:{citySlug:"city",slug:"loc",name:"New name"}){slug}}'),
          {data: {putLocation: {slug: 'loc'}}}
        )

        assert.deepEqual(
          newData,
          {
            artists: {},
            cities: {
              'city': {
                name: 'City',
                locations: {loc: {name: 'New name'}},
                tags: {},
                events: []
              }
            }
          }
        )

        await assert.deepEqual(
          await run('{cities{slug locations{slug name}}}'),
          {data: {cities: [{slug: 'city', locations: [{slug: 'loc', name: 'New name'}]}]}}
        )
      })

      it('propagates changes to events', async function () {
        const initialData = {
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {loc: {name: 'Location'}},
              tags: {},
              events: [
                {
                  location: 'loc',
                  tags: [],
                  occurences: [
                    {start: '2018-07-14T12:00'}
                  ]
                }
              ]
            }
          }
        }

        const api = graphqlApi.make({load: () => initialData, save: () => undefined})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{days(first:"2018-07-14",after:"2018-07-15"){events{location{slug name}}}}}'),
          {data: {cities: [{days: [{events: [{location: {slug: 'loc', name: 'Location'}}]}]}]}}
        )

        await assert.deepEqual(
          await run('mutation{putLocation(location:{citySlug:"city",slug:"loc",name:"New name"}){slug}}'),
          {data: {putLocation: {slug: 'loc'}}}
        )

        await assert.deepEqual(
          await run('{cities{days(first:"2018-07-14",after:"2018-07-15"){events{location{slug name}}}}}'),
          {data: {cities: [{days: [{events: [{location: {slug: 'loc', name: 'New name'}}]}]}]}}
        )
      })
    })

    describe('addEvent', function () {
      it('adds an event', async function () {
        const initialData = {
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'loc': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        }

        var newData = null

        const api = graphqlApi.make({load: () => deepcopy(initialData), save: d => { newData = d }})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time}}}}'),
          {data: {cities: [{slug: 'city', days: [{date: '2018-07-14', events: []}]}]}}
        )

        await assert.deepEqual(
          await run('mutation{addEvent(event:{citySlug:"city",location:"loc",artist:"artist",tags:["tag"],occurences:[{start:"2018-07-14T12:00"}]}){title artist{name} location{name} tags{title} occurences{start}}}'),
          {data: {addEvent: {title: null, artist: {name: 'Artist'}, location: {name: 'Location'}, tags: [{title: 'Tag'}], occurences: [{start: '2018-07-14T12:00'}]}}}
        )

        assert.deepEqual(
          newData,
          {
            artists: {'artist': {name: 'Artist'}},
            cities: {
              'city': {
                name: 'City',
                locations: {'loc': {name: 'Location'}},
                tags: {'tag': {title: 'Tag'}},
                events: [
                  {
                    location: 'loc',
                    artist: 'artist',
                    tags: ['tag'],
                    occurences: [
                      {start: '2018-07-14T12:00'}
                    ]
                  }
                ]
              }
            }
          }
        )

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time artist{name} location{name} tags{title}}}}}'),
          {data: {cities: [{
            slug: 'city',
            days: [{
              date: '2018-07-14',
              events: [{
                time: '12:00',
                artist: {name: 'Artist'},
                location: {name: 'Location'},
                tags: [{title: 'Tag'}]
              }]
            }]
          }]}}
        )
      })

      it("doesn't add event with unexisting artist", async function () {
        const initialData = {
          artists: {},
          cities: {
            'city': {
              name: 'City',
              locations: {'loc': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        }

        var newData = null

        const api = graphqlApi.make({load: () => deepcopy(initialData), save: d => { newData = d }})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time}}}}'),
          {data: {cities: [{slug: 'city', days: [{date: '2018-07-14', events: []}]}]}}
        )

        const result = await run('mutation{addEvent(event:{citySlug:"city",location:"loc",artist:"artist",tags:["tag"],occurences:[{start:"2018-07-14T12:00"}]}){title}}')
        await assert.strictEqual(result.errors[0].message, 'No artist with slug "artist"')

        assert.deepEqual(newData, initialData)

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time}}}}'),
          {data: {cities: [{slug: 'city', days: [{date: '2018-07-14', events: []}]}]}}
        )
      })

      it("doesn't add event with unexisting location", async function () {
        const initialData = {
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        }

        var newData = null

        const api = graphqlApi.make({load: () => deepcopy(initialData), save: d => { newData = d }})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time}}}}'),
          {data: {cities: [{slug: 'city', days: [{date: '2018-07-14', events: []}]}]}}
        )

        const result = await run('mutation{addEvent(event:{citySlug:"city",location:"loc",artist:"artist",tags:["tag"],occurences:[{start:"2018-07-14T12:00"}]}){title}}')
        await assert.strictEqual(result.errors[0].message, 'No location with slug "loc"')

        assert.deepEqual(newData, initialData)

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time}}}}'),
          {data: {cities: [{slug: 'city', days: [{date: '2018-07-14', events: []}]}]}}
        )
      })

      it("doesn't add event with unexisting tag", async function () {
        const initialData = {
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'loc': {name: 'Location'}},
              tags: {'tag': {title: 'Tag'}},
              events: []
            }
          }
        }

        var newData = null

        const api = graphqlApi.make({load: () => deepcopy(initialData), save: d => { newData = d }})

        function run (requestString) {
          return api.request({requestString})
        }

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time}}}}'),
          {data: {cities: [{slug: 'city', days: [{date: '2018-07-14', events: []}]}]}}
        )

        const result = await run('mutation{addEvent(event:{citySlug:"city",location:"loc",artist:"artist",tags:["tag","tageuh"],occurences:[{start:"2018-07-14T12:00"}]}){title}}')
        await assert.strictEqual(result.errors[0].message, 'No tag with slug "tageuh"')

        assert.deepEqual(newData, initialData)

        await assert.deepEqual(
          await run('{cities{slug days(first:"2018-07-14",after:"2018-07-15"){date events{time}}}}'),
          {data: {cities: [{slug: 'city', days: [{date: '2018-07-14', events: []}]}]}}
        )
      })
    })
  })
})
