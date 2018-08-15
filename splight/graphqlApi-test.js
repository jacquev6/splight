'use strict'

/* globals describe, it */

require('stringify').registerWithRequire(['.gqls'])

const assert = require('assert') // Not strict because graphql's returned data doesn't have Object prototype
const graphql = require('graphql')
const Hashids = require('hashids')

const datetime = require('./datetime')
const graphqlApi = require('./graphqlApi')

const hashids = new Hashids('', 10)

describe('graphqlApi', function () {
  describe('make', function () {
    it('works', async function () {
      const {request} = graphqlApi.make({dataDirectory: 'test/data', imagesUrlsPrefix: '/imgs/'})

      assert.deepEqual(
        await request({requestString: '{cities{slug, image}}'}),
        {data: {cities: [
          {slug: 'avalon', 'image': '/imgs/cities/avalon.png'},
          {slug: 'shangri-la', 'image': '/imgs/cities/shangri-la.png'}
        ]}}
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
          tags: [{slug: 'tag', title: 'Tag'}],
          events: [{
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [{start: '2018-07-12T12:00'}]
          }]
        }}
      }

      graphqlApi.forTest.makeRoot(data)

      assert.deepStrictEqual(
        data,
        {
          _: {sequences: {events: 1}},
          artists: {'artist': {name: 'Artist', description: []}},
          cities: {'city': {
            name: 'City',
            locations: {'location': {name: 'Location', description: []}},
            tags: [{slug: 'tag', title: 'Tag'}],
            events: [{
              id: hashids.encode(0),
              location: 'location',
              tags: ['tag'],
              title: 'Title',
              occurrences: [{start: '2018-07-12T12:00'}]
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
          tags: [{slug: 'tag', title: 'Tag'}],
          events: [{
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [{start: '2018-07-12T12:00'}]
          }]
        }}
      }

      graphqlApi.forTest.makeRoot(data)

      assert.deepStrictEqual(
        data,
        {
          _: {sequences: {events: 11}},
          artists: {'artist': {name: 'Artist', description: []}},
          cities: {'city': {
            name: 'City',
            locations: {'location': {name: 'Location', description: []}},
            tags: [{slug: 'tag', title: 'Tag'}],
            events: [{
              id: hashids.encode(10),
              location: 'location',
              tags: ['tag'],
              title: 'Title',
              occurrences: [{start: '2018-07-12T12:00'}]
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
          tags: [{slug: 'tag', title: 'Tag'}],
          events: [{
            id: 'foobarbaz',
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [{start: '2018-07-12T12:00'}]
          }]
        }}
      }

      graphqlApi.forTest.makeRoot(data)

      assert.deepStrictEqual(
        data,
        {
          _: {sequences: {events: 10}},
          artists: {'artist': {name: 'Artist', description: []}},
          cities: {'city': {
            name: 'City',
            locations: {'location': {name: 'Location', description: []}},
            tags: [{slug: 'tag', title: 'Tag'}],
            events: [{
              id: 'foobarbaz',
              location: 'location',
              tags: ['tag'],
              title: 'Title',
              occurrences: [{start: '2018-07-12T12:00'}]
            }]
          }}
        }
      )
    })

    it('rejects wrong tag reference', function () {
      const data = {
        cities: {'city': {
          name: 'City',
          locations: {'location': {name: 'Location'}},
          events: [{
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [{start: '2018-07-12T12:00'}]
          }]
        }}
      }

      assert.throws(
        () => graphqlApi.forTest.makeRoot(data),
        new Error('No tag with slug "tag"')
      )
    })

    it('rejects wrong location reference', function () {
      const data = {
        cities: {'city': {
          name: 'City',
          tags: [{slug: 'tag', title: 'Tag'}],
          events: [{
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [{start: '2018-07-12T12:00'}]
          }]
        }}
      }

      assert.throws(
        () => graphqlApi.forTest.makeRoot(data),
        new Error('No location with slug "location"')
      )
    })

    it('rejects wrong artist reference', function () {
      const data = {
        cities: {'city': {
          name: 'City',
          locations: {'location': {name: 'Location'}},
          tags: [{slug: 'tag', title: 'Tag'}],
          events: [{
            artist: 'artist',
            location: 'location',
            tags: ['tag'],
            title: 'Title',
            occurrences: [{start: '2018-07-12T12:00'}]
          }]
        }}
      }

      assert.throws(
        () => graphqlApi.forTest.makeRoot(data),
        new Error('No artist with slug "artist"')
      )
    })
  })

  function make (data = {}, {generationDate, images, imagesUrlsPrefix} = {}) {
    images = images || {}
    imagesUrlsPrefix = imagesUrlsPrefix || ''
    const rootValue = graphqlApi.forTest.makeRoot(data, generationDate, makeTestImages(images), imagesUrlsPrefix)

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
      graphqlApi.forTest.encapsulateData(expected)
      assert.deepStrictEqual(data, expected)
    }

    function checkImages (expected) {
      assert.deepStrictEqual(images, expected)
    }

    return {checkRequest, checkData, checkImages}
  }

  function makeTestImages (images) {
    function exists (fileName) {
      return !!images[fileName]
    }

    function save (fileName, data) {
      images[fileName] = data && data.toString()
    }

    return {exists, save}
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
        locations{slug name description website image}
        events{
          id
          title
          artist{slug name description website image}
          location{slug name description website image}
          tags{slug title image}
          occurrences{start}
        }
        firstDate
        dateAfter
      }
    }`

    it('returns everything on minimal city', async function () {
      const {checkRequest} = make({
        artists: {
          'artist-1': {name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com'},
          'artist-2': {name: 'Artist 2'}
        },
        cities: {
          'city': {
            name: 'City',
            locations: {
              'location-1': {name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com'},
              'location-2': {name: 'Location 2'}
            },
            tags: [
              {slug: 'tag-1', title: 'Tag 1'},
              {slug: 'tag-2', title: 'Tag 2'}
            ]
          }
        }
      })

      await checkRequest(
        get,
        {data: {
          artists: [
            {slug: 'artist-1', name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com', image: null},
            {slug: 'artist-2', name: 'Artist 2', description: [], website: null, image: null}
          ],
          cities: [{
            slug: 'city',
            name: 'City',
            allTagsImage: null,
            tags: [
              {slug: 'tag-1', title: 'Tag 1', image: null},
              {slug: 'tag-2', title: 'Tag 2', image: null}
            ],
            locations: [
              {slug: 'location-1', name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', image: null},
              {slug: 'location-2', name: 'Location 2', description: [], website: null, image: null}
            ],
            events: [],
            firstDate: null,
            image: null,
            dateAfter: null
          }]
        }}
      )
    })

    it('returns everything on single city with a minimal and a full event', async function () {
      const {checkRequest} = make(
        {
          artists: {
            'artist-1': {name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com'},
            'artist-2': {name: 'Artist 2'}
          },
          cities: {
            'city': {
              name: 'City',
              locations: {
                'location-1': {name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com'},
                'location-2': {name: 'Location 2'}
              },
              tags: [
                {slug: 'tag-1', title: 'Tag 1'},
                {slug: 'tag-2', title: 'Tag 2'}
              ],
              events: [
                {
                  location: 'location-2',
                  tags: ['tag-2'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                },
                {
                  title: 'Title',
                  artist: 'artist-1',
                  location: 'location-1',
                  tags: ['tag-1'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }
              ]
            }
          }
        },
        {
          images: {
            'cities/city.png': true,
            'cities/city/all-tags.png': true,
            'cities/city/locations/location-1.png': true,
            'cities/city/tags/tag-1.png': true,
            'artists/artist-1.png': true
          }
        }
      )

      await checkRequest(
        get,
        {data: {
          artists: [
            {slug: 'artist-1', name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com', image: 'artists/artist-1.png'},
            {slug: 'artist-2', name: 'Artist 2', description: [], website: null, image: null}
          ],
          cities: [{
            slug: 'city',
            name: 'City',
            allTagsImage: 'cities/city/all-tags.png',
            tags: [
              {slug: 'tag-1', title: 'Tag 1', image: 'cities/city/tags/tag-1.png'},
              {slug: 'tag-2', title: 'Tag 2', image: null}
            ],
            locations: [
              {slug: 'location-1', name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', image: 'cities/city/locations/location-1.png'},
              {slug: 'location-2', name: 'Location 2', description: [], website: null, image: null}
            ],
            events: [
              {
                id: hashids.encode(0),
                artist: null,
                title: null,
                location: {slug: 'location-2', name: 'Location 2', description: [], website: null, image: null},
                tags: [{slug: 'tag-2', title: 'Tag 2', image: null}],
                occurrences: [{start: '2018-07-14T12:00'}]
              },
              {
                id: hashids.encode(1),
                artist: {slug: 'artist-1', name: 'Artist 1', description: ['Artist 1 description'], website: 'http://artist-1.com', image: 'artists/artist-1.png'},
                title: 'Title',
                location: {slug: 'location-1', name: 'Location 1', description: ['Location 1 description'], website: 'http://location-1.com', image: 'cities/city/locations/location-1.png'},
                tags: [{slug: 'tag-1', title: 'Tag 1', image: 'cities/city/tags/tag-1.png'}],
                occurrences: [{start: '2018-07-14T12:00'}]
              }
            ],
            firstDate: '2018-07-14',
            image: 'cities/city.png',
            dateAfter: '2018-07-15'
          }]
        }}
      )
    })
  })

  describe('generation', function () {
    it('uses injected date', async function () {
      const {checkRequest} = make({}, {generationDate: datetime.date('2018-08-15')})

      await checkRequest(
        '{generation{date dateAfter}}',
        {data: {generation: {date: '2018-08-15', dateAfter: '2018-09-17'}}}
      )
    })
  })

  describe('city.dates', function () {
    const get = '{cities{slug firstDate dateAfter}}'

    it('returns dates', async function () {
      const {checkRequest} = make({
        cities: {
          'no-events': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: [{slug: 'tag', title: 'Tag'}]
          },
          'single-occurrence': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: [{slug: 'tag', title: 'Tag'}],
            events: [{
              location: 'location',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }]
          },
          'several-occurrences': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: [{slug: 'tag', title: 'Tag'}],
            events: [{
              location: 'location',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}, {start: '2018-07-13T12:00'}, {start: '2018-07-15T12:00'}]
            }]
          },
          'several-events': {
            name: 'City',
            locations: {'location': {name: 'Location'}},
            tags: [{slug: 'tag', title: 'Tag'}],
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
    describe('artists', function () {
      it('filters by name', async function () {
        const {checkRequest} = make({
          artists: {
            'ok-literal': {name: 'name aeiou'},
            'ok-reversed': {name: 'aeiou name'},
            'ok-uppercase': {name: 'NAME AEIOU'},
            'ok-accentuated': {name: 'name àéïôù'},
            'ko-not-all-words': {name: 'name'},
            'ko-title-no-match': {name: 'foobar'}
          }
        })

        await checkRequest(
          '{artists(name:"name aeiou"){slug}}',
          {
            data: {artists: [{slug: 'ok-literal'}, {slug: 'ok-reversed'}, {slug: 'ok-uppercase'}, {slug: 'ok-accentuated'}]}
          }
        )
      })

      it('limits artists returned', async function () {
        const {checkRequest} = make({
          artists: {
            'a-1': {name: '1'},
            'a-2': {name: '2'},
            'a-3': {name: '3'},
            'a-4': {name: '4'}
          }
        })

        await checkRequest(
          '{artists(max:2){slug}}',
          {
            data: {artists: null}
          }
        )

        await checkRequest(
          '{artists(max:3){slug}}',
          {
            data: {artists: null}
          }
        )

        await checkRequest(
          '{artists(max:4){slug}}',
          {
            data: {artists: [{slug: 'a-1'}, {slug: 'a-2'}, {slug: 'a-3'}, {slug: 'a-4'}]}
          }
        )

        await checkRequest(
          '{artists(max:25){slug}}',
          {
            data: {artists: [{slug: 'a-1'}, {slug: 'a-2'}, {slug: 'a-3'}, {slug: 'a-4'}]}
          }
        )
      })
    })

    describe('artist', function () {
      it('finds artist by slug', async function () {
        const {checkRequest} = make({artists: {'artist': {name: 'Artist'}}})

        await checkRequest(
          '{artist(slug:"artist"){name}}',
          {data: {artist: {name: 'Artist'}}}
        )
      })

      it("doesn't find artist by slug", async function () {
        const {checkRequest} = make()

        await checkRequest(
          '{artist(slug:"artist"){name}}',
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 2}],
              message: 'No artist with slug "artist"',
              path: ['artist']
            }]
          }
        )
      })
    })

    describe('city', function () {
      const get = 'query($slug:ID!){city(slug:$slug){name}}'

      it("doesn't find city", async function () {
        const {checkRequest} = make()

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
          cities: {
            'city-1': {name: 'City 1'},
            'city-2': {name: 'City 2'},
            'city-3': {name: 'City 3'}
          }
        })

        await checkRequest(get, {slug: 'city-1'}, {data: {city: {name: 'City 1'}}})
        await checkRequest(get, {slug: 'city-2'}, {data: {city: {name: 'City 2'}}})
        await checkRequest(get, {slug: 'city-3'}, {data: {city: {name: 'City 3'}}})
      })
    })

    describe('city.locations', function () {
      it('filters by name', async function () {
        const {checkRequest} = make({
          cities: {
            'city': {
              name: 'City',
              locations: {
                'ok-literal': {name: 'name aeiou'},
                'ok-reversed': {name: 'aeiou name'},
                'ok-uppercase': {name: 'NAME AEIOU'},
                'ok-accentuated': {name: 'name àéïôù'},
                'ko-not-all-words': {name: 'name'},
                'ko-title-no-match': {name: 'foobar'}
              }
            }
          }
        })

        await checkRequest(
          '{cities{locations(name:"name aeiou"){slug}}}',
          {
            data: {cities: [{
              locations: [{slug: 'ok-literal'}, {slug: 'ok-reversed'}, {slug: 'ok-uppercase'}, {slug: 'ok-accentuated'}]
            }]}
          }
        )
      })

      it('limits locations returned', async function () {
        const {checkRequest} = make({
          cities: {
            'city': {
              name: 'City',
              locations: {
                'l-1': {name: '1'},
                'l-2': {name: '2'},
                'l-3': {name: '3'},
                'l-4': {name: '4'}
              }
            }
          }
        })

        await checkRequest(
          '{cities{locations(max:2){slug}}}',
          {
            data: {cities: [{locations: null}]}
          }
        )

        await checkRequest(
          '{cities{locations(max:3){slug}}}',
          {
            data: {cities: [{locations: null}]}
          }
        )

        await checkRequest(
          '{cities{locations(max:4){slug}}}',
          {
            data: {cities: [{locations: [{slug: 'l-1'}, {slug: 'l-2'}, {slug: 'l-3'}, {slug: 'l-4'}]}]}
          }
        )

        await checkRequest(
          '{cities{locations(max:25){slug}}}',
          {
            data: {cities: [{locations: [{slug: 'l-1'}, {slug: 'l-2'}, {slug: 'l-3'}, {slug: 'l-4'}]}]}
          }
        )
      })
    })

    describe('city.location', function () {
      it('finds location by slug', async function () {
        const {checkRequest} = make({cities: {'city': {name: 'City', locations: {'location': {name: 'Location'}}}}})

        await checkRequest(
          '{city(slug:"city"){location(slug:"location"){name}}}',
          {data: {city: {location: {name: 'Location'}}}}
        )
      })

      it("doesn't find location by slug", async function () {
        const {checkRequest} = make({cities: {'city': {name: 'City'}}})

        await checkRequest(
          '{city(slug:"city"){location(slug:"location"){name}}}',
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 20}],
              message: 'No location with slug "location"',
              path: ['city', 'location']
            }]
          }
        )
      })
    })

    describe('city.events', function () {
      it('filters by tag', async function () {
        const {checkRequest} = make({
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}, {slug: 'other-tag', title: 'Other tag'}],
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
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}, 'other-location': {name: 'Other location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
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
              tags: [{slug: 'tag', title: 'Tag'}],
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
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
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
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
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
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
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
      it('finds event by id', async function () {
        const {checkRequest} = make({
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
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
        const {checkRequest} = make({cities: {'city': {name: 'City'}}})

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
    const pngData = 'anything'
    const pngDataBase64 = Buffer.from(pngData).toString('base64')
    const pngDataUrl = 'data:image/png;base64,' + pngDataBase64

    describe('putArtist', function () {
      const fields = 'slug name description website image'
      const get = `{artists{${fields}}}`
      const put = `mutation($artist:IArtist!){putArtist(artist:$artist){${fields}}}`

      it('adds an artist', async function () {
        const {checkRequest, checkData, checkImages} = make()

        await checkRequest(get, {data: {artists: []}})

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl}},
          {data: {putArtist: {slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}}}
        )

        checkData({artists: {'artist': {name: 'Artist', description: ['Description'], website: 'http://foo.bar'}}})

        checkImages({'artists/artist.png': pngData})

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}]}})
      })

      it("doesn't add an artist with a bad slug", async function () {
        const {checkRequest, checkData, checkImages} = make()

        await checkRequest(
          put,
          {artist: {slug: 'A', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl}},
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 28}],
              message: 'Incorrect slug',
              path: ['putArtist']
            }]
          }
        )

        checkData({})
        checkImages({})
      })

      it('modifies an artist', async function () {
        const {checkRequest, checkData, checkImages} = make({artists: {'artist': {name: 'Artist'}}})

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'Artist', description: [], website: null, image: null}]}})

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl}},
          {data: {putArtist: {slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}}}
        )

        checkData({artists: {'artist': {name: 'New name', description: ['Description'], website: 'http://foo.bar'}}})
        checkImages({'artists/artist.png': pngData})

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}]}})
      })

      it('modifies an artist - no change', async function () {
        const {checkRequest, checkData, checkImages} = make(
          {artists: {'artist': {name: 'Artist', description: ['Description'], website: 'http://foo.bar'}}},
          {images: {'artists/artist.png': pngData}}
        )

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}]}})

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}},
          {data: {putArtist: {slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}}}
        )

        checkData({artists: {'artist': {name: 'Artist', description: ['Description'], website: 'http://foo.bar'}}})
        checkImages({'artists/artist.png': pngData})

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}]}})
      })

      it('modifies an artist - reset', async function () {
        const {checkRequest, checkData, checkImages} = make(
          {artists: {'artist': {name: 'Artist', description: ['Description'], website: 'http://foo.bar'}}},
          {images: {'artists/artist.png': pngData}}
        )

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'Artist', description: ['Description'], website: 'http://foo.bar', image: 'artists/artist.png'}]}})

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'New name', description: []}},
          {data: {putArtist: {slug: 'artist', name: 'New name', description: [], website: null, image: null}}}
        )

        checkData({artists: {'artist': {name: 'New name', description: []}}})
        checkImages({'artists/artist.png': undefined})

        await checkRequest(get, {data: {artists: [{slug: 'artist', name: 'New name', description: [], website: null, image: null}]}})
      })

      it('propagates changes to events', async function () {
        const {checkRequest} = make(
          {
            artists: {'artist': {name: 'Artist'}},
            cities: {
              'city': {
                name: 'City',
                locations: {'location': {name: 'Location'}},
                tags: [{slug: 'tag', title: 'Tag'}],
                events: [{
                  artist: 'artist',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T12:00'}]
                }]
              }
            }
          },
          {images: {'artists/artist.png': pngData}}
        )

        const getEvents = `{cities{events{artist{${fields}}}}}`

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{artist: {slug: 'artist', name: 'Artist', description: [], website: null, image: 'artists/artist.png'}}]}]}}
        )

        await checkRequest(
          put,
          {artist: {slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar'}},
          {data: {putArtist: {slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: null}}}
        )

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{artist: {slug: 'artist', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: null}}]}]}}
        )
      })
    })

    describe('putLocation', function () {
      const fields = 'slug name description website image'
      const get = `{cities{slug locations{${fields}}}}`
      const put = `mutation($citySlug:ID!,$location:ILocation!){putLocation(citySlug:$citySlug,location:$location){${fields}}}`

      it('adds a location', async function () {
        const {checkRequest, checkData, checkImages} = make({cities: {'city': {name: 'City'}}})

        await checkRequest(get, {data: {cities: [{slug: 'city', locations: []}]}})

        await checkRequest(
          put,
          {citySlug: 'city', location: {slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl}},
          {data: {putLocation: {slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: 'cities/city/locations/location.png'}}}
        )

        checkData({
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location', description: ['Description'], website: 'http://foo.bar'}}
            }
          }
        })

        checkImages({'cities/city/locations/location.png': pngData})

        await checkRequest(get, {data: {cities: [{slug: 'city', locations: [{slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: 'cities/city/locations/location.png'}]}]}})
      })

      it("doesn't add a location with bad slug", async function () {
        const {checkRequest, checkData, checkImages} = make({cities: {'city': {name: 'City'}}})

        await checkRequest(
          put,
          {citySlug: 'city', location: {slug: 'L', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl}},
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 46}],
              message: 'Incorrect slug',
              path: ['putLocation']
            }]
          }
        )

        checkData({cities: {'city': {name: 'City'}}})

        checkImages({})
      })

      it('modifies a location', async function () {
        const {checkRequest, checkData, checkImages} = make({
          cities: {'city': {name: 'City', locations: {'location': {name: 'Location'}}}}
        })

        await checkRequest(get, {data: {cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: [],
            website: null,
            image: null
          }]
        }]}})

        await checkRequest(
          put,
          {citySlug: 'city', location: {slug: 'location', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: pngDataUrl}},
          {data: {putLocation: {slug: 'location', name: 'New name', description: ['Description'], website: 'http://foo.bar', image: 'cities/city/locations/location.png'}}}
        )

        checkData({
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'New name', description: ['Description'], website: 'http://foo.bar'}}
            }
          }
        })

        checkImages({'cities/city/locations/location.png': pngData})

        await checkRequest(get, {data: {cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'New name',
            description: ['Description'],
            website: 'http://foo.bar',
            image: 'cities/city/locations/location.png'
          }]
        }]}})
      })

      it('modifies a location - no change', async function () {
        const {checkRequest, checkData, checkImages} = make(
          {cities: {'city': {name: 'City', locations: {'location': {name: 'Location', description: ['Description'], website: 'http://foo.bar'}}}}},
          {images: {'cities/city/locations/location.png': pngData}}
        )

        await checkRequest(get, {data: {cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: ['Description'],
            website: 'http://foo.bar',
            image: 'cities/city/locations/location.png'
          }]
        }]}})

        await checkRequest(
          put,
          {citySlug: 'city', location: {slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: 'cities/city/locations/location.png'}},
          {data: {putLocation: {slug: 'location', name: 'Location', description: ['Description'], website: 'http://foo.bar', image: 'cities/city/locations/location.png'}}}
        )

        checkData({
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location', description: ['Description'], website: 'http://foo.bar'}}
            }
          }
        })

        checkImages({'cities/city/locations/location.png': pngData})

        await checkRequest(get, {data: {cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: ['Description'],
            website: 'http://foo.bar',
            image: 'cities/city/locations/location.png'
          }]
        }]}})
      })

      it('modifies a location - reset', async function () {
        const {checkRequest, checkData, checkImages} = make(
          {cities: {'city': {name: 'City', locations: {'location': {name: 'Location', description: ['Description'], website: 'http://foo.bar'}}}}},
          {images: {'cities/city/locations/location.png': pngData}}
        )

        await checkRequest(get, {data: {cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'Location',
            description: ['Description'],
            website: 'http://foo.bar',
            image: 'cities/city/locations/location.png'
          }]
        }]}})

        await checkRequest(
          put,
          {citySlug: 'city', location: {slug: 'location', name: 'New name', description: []}},
          {data: {putLocation: {slug: 'location', name: 'New name', description: [], website: null, image: null}}}
        )

        checkData({
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'New name', description: []}}
            }
          }
        })

        checkImages({'cities/city/locations/location.png': undefined})

        await checkRequest(get, {data: {cities: [{
          slug: 'city',
          locations: [{
            slug: 'location',
            name: 'New name',
            description: [],
            website: null,
            image: null
          }]
        }]}})
      })

      it('propagates changes to events', async function () {
        const {checkRequest} = make({
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
              events: [{
                location: 'location',
                tags: ['tag'],
                occurrences: [{start: '2018-07-14T12:00'}]
              }]
            }
          }
        })

        const getEvents = `{cities{events{location{${fields}}}}}`

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{location: {slug: 'location', name: 'Location', description: [], website: null, image: null}}]}]}}
        )

        await checkRequest(
          put,
          {citySlug: 'city', location: {slug: 'location', name: 'New name', description: [], image: pngDataUrl}},
          {data: {putLocation: {slug: 'location', name: 'New name', description: [], website: null, image: 'cities/city/locations/location.png'}}}
        )

        await checkRequest(
          getEvents,
          {data: {cities: [{events: [{location: {slug: 'location', name: 'New name', description: [], website: null, image: 'cities/city/locations/location.png'}}]}]}}
        )
      })
    })

    describe('putEvent', function () {
      const fields = 'id title artist{name} location{name} tags{title} occurrences{start}'
      const get = `{cities{slug events{${fields}}}}`
      const put = `mutation($citySlug:ID!,$event:IEvent!){putEvent(citySlug:$citySlug,event:$event){${fields}}}`

      it('adds an event', async function () {
        const {checkRequest, checkData} = make({
          _: {sequences: {events: 12}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}]
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              title: 'Title',
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }
          },
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
              tags: [{slug: 'tag', title: 'Tag'}],
              events: [{
                id: hashids.encode(12),
                location: 'location',
                artist: 'artist',
                tags: ['tag'],
                occurrences: [{start: '2018-07-14T12:00'}],
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
              tags: [{slug: 'tag', title: 'Tag'}]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{slug: 'city', events: []}]}}
        )

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }
          },
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
              tags: [{slug: 'tag', title: 'Tag'}],
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
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{slug: 'city', events: []}]}}
        )

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              title: 'Title',
              location: 'location',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }
          },
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
              tags: [{slug: 'tag', title: 'Tag'}],
              events: [{
                id: hashids.encode(0),
                title: 'Title',
                location: 'location',
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
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}]
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 40}],
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
              tags: [{slug: 'tag', title: 'Tag'}],
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
              tags: [{slug: 'tag', title: 'Tag'}]
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 40}],
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
              tags: [{slug: 'tag', title: 'Tag'}],
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
              locations: {'location': {name: 'Location'}}
            }
          }
        })

        await checkRequest(get, {data: {cities: [{slug: 'city', events: []}]}})

        await checkRequest(
          put,
          {
            citySlug: 'city',
            event: {
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T12:00'}]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 40}],
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
              tags: [],
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
              tags: [{slug: 'tag', title: 'Tag'}],
              events: [
                {
                  id: 'otherEvent',
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
                id: 'otherEvent',
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
          {
            citySlug: 'city',
            event: {
              id: 'event',
              title: 'Title',
              location: 'location',
              artist: 'artist',
              tags: ['tag'],
              occurrences: [{start: '2018-07-14T13:00'}]
            }
          },
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
              tags: [{slug: 'tag', title: 'Tag'}],
              events: [
                {
                  id: 'otherEvent',
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
                id: 'otherEvent',
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
              tags: [{slug: 'tag', title: 'Tag'}]
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
              occurrences: [{start: '2018-07-14T13:00'}]
            }
          },
          {
            data: null,
            errors: [{
              locations: [{line: 1, column: 40}],
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
              tags: [{slug: 'tag', title: 'Tag'}],
              events: []
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
        const {checkRequest, checkData} = make({
          _: {sequences: {events: 12}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
              events: [
                {
                  id: 'otherEvent',
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
          {data: {cities: [{slug: 'city', events: [{id: 'otherEvent'}, {id: 'event'}]}]}}
        )

        await checkRequest(
          del,
          {
            citySlug: 'city',
            eventId: 'event'
          },
          {data: {deleteEvent: {id: 'event'}}}
        )

        checkData({
          _: {sequences: {events: 12}},
          artists: {'artist': {name: 'Artist'}},
          cities: {
            'city': {
              name: 'City',
              locations: {'location': {name: 'Location'}},
              tags: [{slug: 'tag', title: 'Tag'}],
              events: [
                {
                  id: 'otherEvent',
                  location: 'location',
                  tags: ['tag'],
                  occurrences: [{start: '2018-07-14T11:00'}]
                }
              ]
            }
          }
        })

        await checkRequest(
          get,
          {data: {cities: [{slug: 'city', events: [{id: 'otherEvent'}]}]}}
        )
      })

      it("doesn't delete an unexisting event", async function () {
        const {checkRequest, checkData} = make({
          cities: {'city': {'name': 'City'}}
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
              locations: [{line: 1, column: 38}],
              message: 'No event with id "event"',
              path: ['deleteEvent']
            }]
          }
        )

        checkData({
          _: {sequences: {events: 0}},
          artists: {},
          cities: {
            'city': {name: 'City', events: [], tags: [], locations: {}}
          }
        })
      })
    })

    it('adds artist, location and event in a single call', async function () {
      const {checkRequest, checkData} = make({
        cities: {'city': {
          name: 'City',
          tags: [{slug: 'tag', title: 'Tag'}]
        }}
      })

      await checkRequest(
        'mutation{' +
          'putArtist(artist:{slug:"artist",name:"Artist",description:["Some artist"],website:"http://artist.bar"}){slug name description website}' +
          'putLocation(citySlug:"city",location:{slug:"location",name:"Location",description:["Some location"],website:"http://location.bar"}){slug name description website}' +
          'putEvent(citySlug:"city",event:{location:"location",artist:"artist",tags:["tag"],occurrences:[{start:"2018-07-14T12:00"}]}){id artist{slug name description website} location{slug name description website} tags{slug title}}' +
        '}',
        {data: {
          putArtist: {slug: 'artist', name: 'Artist', description: ['Some artist'], website: 'http://artist.bar'},
          putLocation: {slug: 'location', name: 'Location', description: ['Some location'], website: 'http://location.bar'},
          putEvent: {
            id: hashids.encode(0),
            artist: {slug: 'artist', name: 'Artist', description: ['Some artist'], website: 'http://artist.bar'},
            location: {slug: 'location', name: 'Location', description: ['Some location'], website: 'http://location.bar'},
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
        artists: {artist: {name: 'Artist', description: ['Some artist'], website: 'http://artist.bar'}},
        cities: {'city': {
          name: 'City',
          locations: {'location': {name: 'Location', description: ['Some location'], website: 'http://location.bar'}},
          events: [{
            id: hashids.encode(0),
            artist: 'artist',
            location: 'location',
            tags: ['tag'],
            occurrences: [{start: '2018-07-14T12:00'}]
          }],
          tags: [{slug: 'tag', title: 'Tag'}]
        }}
      })
    })
  })
})
