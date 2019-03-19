'use strict'

/* globals describe, context, beforeEach, it */

const gql = require('graphql-tag')

const testUtils = require('./test-utils')

describe('API black-box test', function () {
  // These tests don't know anything about the underlying implementation.
  // I expect this will make them very robust to changes in said implementation.
  // So, this is where we should test all externaly-observable behavior.

  const VALID_SLUGS = ['slug', 'a0', 'a-', 'a-0', 'abc-def']
  const BAD_SLUGS = ['0', '0abc', '-', '-abc']

  const BAD_SLUG_ERROR = "Un slug doit être constitué d'une lettre, éventuellement suivi de lettres, chiffres, ou tirets."
  const DUPLICATE_ARTIST_SLUG_ERROR = 'Les slugs de chaque artiste doivent être uniques.'
  const BAD_ARTIST_NAME_ERROR = "Le nom d'un artiste ne peut pas être vide."
  const DUPLICATE_CITY_SLUG_ERROR = 'Les slugs de chaque ville doivent être uniques.'
  const BAD_CITY_NAME_ERROR = "Le nom d'une ville ne peut pas être vide."
  const DUPLICATE_LOCATION_SLUG_ERROR = "Les slugs de chaque lieu doivent être uniques au sein d'une ville."
  const BAD_LOCATION_NAME_ERROR = "Le nom d'un lieu ne peut pas être vide."
  const MISSING_EVENT_LOCATION_ERROR = 'Un événement doit avoir un lieu.'
  const MISSING_EVENT_TAGS_ERROR = 'Un événement doit avoir au moins une catégorie.'
  const MISSING_EVENT_OCCURRENCES_ERROR = 'Un événement doit avoir au moins une représentation.'

  const { run, success, error, reset } = testUtils()

  const validateArtist = gql`
    query($forInsert: Boolean!, $artist: IArtist!) {
      validateArtist(forInsert: $forInsert, artist: $artist) {
        slug
        name
        description
        website
        image
      }
    }
  `

  const putArtist = gql`
    mutation($artist: IArtist!) {
      putArtist(artist: $artist) {
        slug
      }
    }
  `

  const getArtist = gql`
    query($slug: ID!) {
      artist(slug: $slug) {
      slug
      name
      description
      website
      image
      }
    }
  `

  const getArtists = gql`
    query($name: String) {
      artists(name: $name) {
        slug
      }
    }
  `

  const validateCity = gql`
    query($forInsert: Boolean!, $city: ICity!) {
      validateCity(forInsert: $forInsert, city: $city) {
        slug
        name
        tags
        image
        allTagsImage
      }
    }
  `

  const putCity = gql`
    mutation($city: ICity!) {
      putCity(city: $city) {
        slug
      }
    }
  `

  const getCity = gql`
    query($slug: ID!) {
      city(slug: $slug) {
        slug
        name
        tags {
          slug
          title
          image
        }
        image
        allTagsImage
      }
    }
  `

  const getCityDates = gql`
    query($slug: ID!) {
      city(slug: $slug) {
        slug
        firstDate
        dateAfter
      }
    }
  `

  const getCities = gql`
    query {
      cities {
        slug
      }
    }
  `

  const validateLocation = gql`
    query($forInsert: Boolean!, $citySlug: ID!, $location: ILocation!) {
      validateLocation(forInsert: $forInsert, citySlug: $citySlug, location: $location) {
        slug
        name
        description
        website
        image
        phone
        address
      }
    }
  `

  const putLocation = gql`
    mutation($citySlug: ID!, $location: ILocation!) {
      putLocation(citySlug: $citySlug, location: $location) {
        slug
      }
    }
  `

  const getLocation = gql`
    query($citySlug: ID!, $locationSlug: ID!) {
      city(slug: $citySlug) {
        location(slug: $locationSlug) {
          slug
          name
          description
          website
          image
          phone
          address
        }
      }
    }
  `

  const getLocations = gql`
    query($citySlug: ID!, $name: String) {
      city(slug: $citySlug) {
        locations(name: $name) {
          slug
        }
      }
    }
  `

  const validateEvent = gql`
    query($forInsert: Boolean!, $citySlug: ID!, $event: IEvent!) {
      validateEvent(forInsert: $forInsert, citySlug: $citySlug, event: $event) {
        id
        title
        artist
        location
        tags
        occurrences
        reservationPage
      }
    }
  `

  const putEvent = gql`
    mutation($citySlug: ID!, $event: IEvent!) {
      putEvent(citySlug: $citySlug, event: $event) {
        id
      }
    }
  `

  const getEvent = gql`
    query($citySlug: ID!, $eventId: ID!) {
      city(slug: $citySlug) {
        event(id: $eventId) {
          id
          title
          artist {
            slug
          }
          location {
            slug
          }
          tags {
            slug
          }
          occurrences {
            start
          }
          reservationPage
        }
      }
    }
  `

  const getEvents = gql`
    query($citySlug: ID!) {
      city(slug: $citySlug) {
        events {
          id
        }
      }
    }
  `

  const getEventTitles = gql`
    query($citySlug: ID!, $tag: ID, $location: ID, $artist: ID, $title: String, $dates: IDateInterval) {
      city(slug: $citySlug) {
        events(tag: $tag, location: $location, artist: $artist, title: $title, dates: $dates) {
          title
        }
      }
    }
  `

  const deleteEvent = gql`
    mutation($citySlug: ID!, $eventId: ID!) {
      deleteEvent(citySlug: $citySlug, eventId: $eventId) {
        id
      }
    }
  `

  beforeEach(reset)

  function withoutCities (f) {
    context('without cities', f)
  }

  function withCities (f) {
    context('with cities', function () {
      beforeEach(() => Promise.all(
        [1, 2, 3].map(i => run(putCity, { city: {
          slug: 'city-' + i,
          name: 'City Name ' + i,
          tags: [1, 2, 3].map(j => ({ slug: 'tag-' + j, title: 'Tag Title ' + i + '.' + j }))
        } }))
      ))
      f()
    })
  }

  function withoutArtists (f) {
    context('without artists', f)
  }

  function withArtists (f) {
    context('with artists', function () {
      beforeEach(() => Promise.all(
        [1, 2, 3].map(i => run(putArtist, { artist: { slug: 'artist-' + i, name: 'Artist Name ' + i } }))
      ))
      f()
    })
  }

  function withoutLocations (f) {
    context('without locations', f)
  }

  function withLocations (f) {
    context('with locations', function () {
      beforeEach(() => Promise.all(
        [1, 2, 3].map(i => Promise.all(
          [1, 2, 3].map(j => run(putLocation, {
            citySlug: 'city-' + i, location: { slug: 'location-' + j, name: 'Location Name ' + i + '.' + j }
          }))
        ))
      ))
      f()
    })
  }

  function withoutEvents (f) {
    context('without events', f)
  }

  function withEvents (f) {
    context('with events', function () {
      beforeEach(async () => {
        // Create events in sequence to ensure ids are stable
        for (var i = 1; i !== 4; ++i) {
          for (var j = 1; j !== 4; ++j) {
            await run(putEvent, {
              citySlug: 'city-' + i,
              event: {
                location: 'location-1',
                title: 'Event Title ' + i + '.' + j,
                tags: ['tag-1'],
                occurrences: [{ start: '2019-01-01T12:00' }]
              }
            })
          }
        }
      })
      f()
    })
  }

  describe('putCity', function () {
    withoutCities(function () {
      it('creates city', async function () {
        await error(
          getCity, { slug: 'city-0' },
          'Pas de ville avec le slug "city-0"'
        )
        await success(
          putCity, { city: { slug: 'city-0', name: 'City Name' } },
          { putCity: { slug: 'city-0' } }
        )
        await success(
          getCity, { slug: 'city-0' },
          { city: { slug: 'city-0', name: 'City Name', tags: [], image: null, allTagsImage: null } }
        )
      })

      it('cannot create bad city', async function () {
        await error(
          putCity, { city: { slug: '0', name: 'City Name' } },
          BAD_SLUG_ERROR
        )
      })
    })

    withCities(function () {
      it('edits city', async function () {
        await success(
          getCity, { slug: 'city-1' },
          { city: {
            slug: 'city-1',
            name: 'City Name 1',
            tags: [
              { slug: 'tag-1', title: 'Tag Title 1.1', image: null },
              { slug: 'tag-2', title: 'Tag Title 1.2', image: null },
              { slug: 'tag-3', title: 'Tag Title 1.3', image: null }
            ],
            image: null,
            allTagsImage: null } }
        )
        await success(
          putCity, { city: {
            slug: 'city-1',
            name: 'New City Name 1',
            tags: [{ slug: 'tag-0', title: 'Tag Title', image: 'http://foo.bar/img0' }],
            image: 'http://foo.bar/img1',
            allTagsImage: 'http://foo.bar/img2'
          } },
          { putCity: { slug: 'city-1' } }
        )
        await success(
          getCity, { slug: 'city-1' },
          { city: {
            slug: 'city-1',
            name: 'New City Name 1',
            tags: [{ slug: 'tag-0', title: 'Tag Title', image: 'http://foo.bar/img0' }],
            image: 'http://foo.bar/img1',
            allTagsImage: 'http://foo.bar/img2'
          } }
        )
      })
    })
  })

  describe('getCities', function () {
    withoutCities(function () {
      it('finds no cities', async function () {
        await success(
          getCities, {},
          { cities: [] }
        )
      })
    })

    withCities(function () {
      it('finds cities', async function () {
        await success(
          getCities, {},
          { cities: [{ slug: 'city-1' }, { slug: 'city-2' }, { slug: 'city-3' }] }
        )
      })
    })
  })

  describe('validateCity', function () {
    withoutCities(function () {
      it('accepts a valid city for insert', async function () {
        await success(
          validateCity, { forInsert: true, city: { slug: 'city-0', name: 'City Name' } },
          { validateCity: { slug: null, name: null, tags: null, image: null, allTagsImage: null } }
        )
      })

      it('accepts valid slugs', async function () {
        await Promise.all(VALID_SLUGS.map(slug =>
          success(
            validateCity, { forInsert: true, city: { slug, name: 'City Name' } },
            { validateCity: { slug: null, name: null, tags: null, image: null, allTagsImage: null } }
          )
        ))
      })

      it('reports slug format error', async function () {
        await Promise.all(BAD_SLUGS.map(slug =>
          success(
            validateCity, { forInsert: true, city: { slug, name: 'City Name' } },
            { validateCity: { slug: BAD_SLUG_ERROR, name: null, tags: null, image: null, allTagsImage: null } }
          )
        ))
      })

      it('reports name format error', async function () {
        await success(
          validateCity, { forInsert: true, city: { slug: 'city-0', name: '' } },
          { validateCity: { slug: null, name: BAD_CITY_NAME_ERROR, tags: null, image: null, allTagsImage: null } }
        )
      })
    })

    withCities(function () {
      it('accepts a valid city for edit', async function () {
        await success(
          validateCity, { forInsert: false, city: { slug: 'city-1', name: 'City Name' } },
          { validateCity: { slug: null, name: null, tags: null, image: null, allTagsImage: null } }
        )
      })

      it('reports a duplicate city for insert', async function () {
        await success(
          validateCity, { forInsert: true, city: { slug: 'city-1', name: 'City Name' } },
          { validateCity: { slug: DUPLICATE_CITY_SLUG_ERROR, name: null, tags: null, image: null, allTagsImage: null } }
        )
      })
    })
  })

  describe('putArtist', function () {
    withoutArtists(function () {
      it('creates artist', async function () {
        await error(
          getArtist, { slug: 'artist-0' },
          'Pas d\'artiste avec le slug "artist-0"'
        )
        await success(
          putArtist, { artist: { slug: 'artist-0', name: 'Artist Name' } },
          { putArtist: { slug: 'artist-0' } }
        )
        await success(
          getArtist, { slug: 'artist-0' },
          { artist: { slug: 'artist-0', name: 'Artist Name', description: [], website: null, image: null } }
        )
      })
    })

    withArtists(function () {
      it('edits artist', async function () {
        await success(
          getArtist, { slug: 'artist-1' },
          { artist: { slug: 'artist-1', name: 'Artist Name 1', description: [], website: null, image: null } }
        )
        await success(
          putArtist, { artist: {
            slug: 'artist-1',
            name: 'New Artist Name 1',
            description: ['Artist description 1', 'Artist description 2'],
            website: 'http://foo.bar/',
            image: 'http://foo.bar/img1'
          } },
          { putArtist: { slug: 'artist-1' } }
        )
        await success(
          getArtist, { slug: 'artist-1' },
          { artist: {
            slug: 'artist-1',
            name: 'New Artist Name 1',
            description: ['Artist description 1', 'Artist description 2'],
            website: 'http://foo.bar/',
            image: 'http://foo.bar/img1'
          } }
        )
      })
    })
  })

  describe('getArtists', function () {
    withoutArtists(function () {
      it('finds no artists', async function () {
        await success(
          getArtists, {},
          { artists: [] }
        )
      })
    })

    withArtists(function () {
      it('finds artists', async function () {
        await success(
          getArtists, {},
          { artists: [{ slug: 'artist-1' }, { slug: 'artist-2' }, { slug: 'artist-3' }] }
        )
      })
    })

    it('filters by name', async function () {
      await run(putArtist, { artist: { slug: 'ok-literal', name: 'name aeiou' } })
      await run(putArtist, { artist: { slug: 'ok-reversed', name: 'aeiou name' } })
      await run(putArtist, { artist: { slug: 'ok-uppercase', name: 'NAME AEIOU' } })
      await run(putArtist, { artist: { slug: 'ok-accentuated', name: 'name àéïôù' } })
      await run(putArtist, { artist: { slug: 'ko-not-all-words', name: 'name' } })
      await run(putArtist, { artist: { slug: 'ko-title-no-match', name: 'foobar' } })

      await success(
        getArtists, { name: 'name aeiou' },
        { artists: [{ slug: 'ok-literal' }, { slug: 'ok-reversed' }, { slug: 'ok-uppercase' }, { slug: 'ok-accentuated' }] }
      )
    })
  })

  describe('validateArtist', function () {
    withoutArtists(function () {
      it('accepts a valid artist for insert', async function () {
        await success(
          validateArtist, { forInsert: true, artist: { slug: 'artist-0', name: 'Artist Name' } },
          { validateArtist: { slug: null, name: null, description: null, website: null, image: null } }
        )
      })

      it('accepts valid slugs', async function () {
        await Promise.all(VALID_SLUGS.map(slug =>
          success(
            validateArtist, { forInsert: true, artist: { slug, name: 'Artist Name' } },
            { validateArtist: { slug: null, name: null, description: null, website: null, image: null } }
          )
        ))
      })

      it('reports slug format error', async function () {
        await Promise.all(BAD_SLUGS.map(slug =>
          success(
            validateArtist, { forInsert: true, artist: { slug, name: 'Artist Name' } },
            { validateArtist: { slug: BAD_SLUG_ERROR, name: null, description: null, website: null, image: null } }
          )
        ))
      })

      it('reports name format error', async function () {
        await success(
          validateArtist, { forInsert: true, artist: { slug: 'artist-0', name: '' } },
          { validateArtist: { slug: null, name: BAD_ARTIST_NAME_ERROR, description: null, website: null, image: null } }
        )
      })
    })

    withArtists(function () {
      it('accepts a valid artist for edit', async function () {
        await success(
          validateArtist, { forInsert: false, artist: { slug: 'artist-1', name: 'Artist Name' } },
          { validateArtist: { slug: null, name: null, description: null, website: null, image: null } }
        )
      })

      it('reports a duplicate artist for insert', async function () {
        await success(
          validateArtist, { forInsert: true, artist: { slug: 'artist-1', name: 'Artist Name' } },
          { validateArtist: {
            slug: DUPLICATE_ARTIST_SLUG_ERROR,
            name: null,
            description: null,
            website: null,
            image: null
          } }
        )
      })
    })
  })

  describe('putLocation', function () {
    withoutCities(function () {
      it('cannot create location', async function () {
        await error(
          putLocation, { citySlug: 'city-0', location: { slug: 'location-0', name: 'Location Name' } },
          'Pas de ville avec le slug "city-0"'
        )
      })
    })

    withCities(function () {
      withoutLocations(function () {
        it('creates location', async function () {
          await error(
            getLocation, { citySlug: 'city-1', locationSlug: 'location-0' },
            'Pas de lieu avec le slug "location-0" dans la ville avec le slug "city-1"'
          )
          await success(
            putLocation, { citySlug: 'city-1', location: { slug: 'location-0', name: 'Location Name' } },
            { putLocation: { slug: 'location-0' } }
          )
          await success(
            getLocation, { citySlug: 'city-1', locationSlug: 'location-0' },
            { city: { location: {
              slug: 'location-0',
              name: 'Location Name',
              description: [],
              website: null,
              image: null,
              address: [],
              phone: null
            } } }
          )
        })
      })

      withLocations(function () {
        it('edits location', async function () {
          await success(
            getLocation, { citySlug: 'city-1', locationSlug: 'location-1' },
            { city: { location: {
              slug: 'location-1',
              name: 'Location Name 1.1',
              description: [],
              website: null,
              image: null,
              address: [],
              phone: null
            } } }
          )
          await success(
            putLocation, {
              citySlug: 'city-1',
              location: {
                slug: 'location-1',
                name: 'New Location Name 1',
                description: ['Location description 1', 'Location description 2'],
                website: 'http://foo.bar/',
                image: 'http://foo.bar/img1',
                address: ['Location address 1', 'Location address 2'],
                phone: 'Location phone'
              } },
            { putLocation: { slug: 'location-1' } }
          )
          await success(
            getLocation, { citySlug: 'city-1', locationSlug: 'location-1' },
            { city: { location: {
              slug: 'location-1',
              name: 'New Location Name 1',
              description: ['Location description 1', 'Location description 2'],
              website: 'http://foo.bar/',
              image: 'http://foo.bar/img1',
              address: ['Location address 1', 'Location address 2'],
              phone: 'Location phone'
            } } }
          )
        })
      })
    })
  })

  describe('getLocations', function () {
    withCities(function () {
      withoutLocations(function () {
        it('finds no locations', async function () {
          await success(
            getLocations, { citySlug: 'city-1' },
            { city: { locations: [] } }
          )
        })
      })

      withLocations(function () {
        it('finds locations', async function () {
          await success(
            getLocations, { citySlug: 'city-1' },
            { city: { locations: [
              { slug: 'location-1' }, { slug: 'location-2' }, { slug: 'location-3' }
            ] } }
          )
        })
      })

      it('filters by name', async function () {
        await run(putLocation, { citySlug: 'city-1', location: { slug: 'ok-literal', name: 'name aeiou' } })
        await run(putLocation, { citySlug: 'city-1', location: { slug: 'ok-reversed', name: 'aeiou name' } })
        await run(putLocation, { citySlug: 'city-1', location: { slug: 'ok-uppercase', name: 'NAME AEIOU' } })
        await run(putLocation, { citySlug: 'city-1', location: { slug: 'ok-accentuated', name: 'name àéïôù' } })
        await run(putLocation, { citySlug: 'city-1', location: { slug: 'ko-not-all-words', name: 'name' } })
        await run(putLocation, { citySlug: 'city-1', location: { slug: 'ko-title-no-match', name: 'foobar' } })

        await success(
          getLocations, { citySlug: 'city-1', name: 'name aeiou' },
          { city: { locations: [{ slug: 'ok-literal' }, { slug: 'ok-reversed' }, { slug: 'ok-uppercase' }, { slug: 'ok-accentuated' }] } }
        )
      })
    })
  })

  describe('validateLocation', function () {
    withCities(function () {
      withoutLocations(function () {
        it('accepts a valid location for insert', async function () {
          await success(
            validateLocation, {
              forInsert: true, citySlug: 'city-1', location: { slug: 'location-0', name: 'Location Name' }
            },
            { validateLocation: {
              slug: null, name: null, description: null, website: null, image: null, phone: null, address: null
            } }
          )
        })

        it('accepts valid slugs', async function () {
          await Promise.all(VALID_SLUGS.map(slug =>
            success(
              validateLocation, { forInsert: true, citySlug: 'city-1', location: { slug, name: 'Location Name' } },
              { validateLocation: {
                slug: null, name: null, description: null, website: null, image: null, phone: null, address: null
              } }
            )
          ))
        })

        it('reports slug format error', async function () {
          await Promise.all(BAD_SLUGS.map(slug =>
            success(
              validateLocation, { forInsert: true, citySlug: 'city-1', location: { slug, name: 'Location Name' } },
              { validateLocation: {
                slug: BAD_SLUG_ERROR,
                name: null,
                description: null,
                website: null,
                image: null,
                phone: null,
                address: null
              } }
            )
          ))
        })

        it('reports name format error', async function () {
          await success(
            validateLocation, { forInsert: true, citySlug: 'city-1', location: { slug: 'location-0', name: '' } },
            { validateLocation: {
              slug: null,
              name: BAD_LOCATION_NAME_ERROR,
              description: null,
              website: null,
              image: null,
              phone: null,
              address: null
            } }
          )
        })
      })

      withLocations(function () {
        it('accepts edit', async function () {
          await success(
            validateLocation, {
              forInsert: false, citySlug: 'city-1', location: { slug: 'location-1', name: 'Location Name' }
            },
            { validateLocation: {
              slug: null,
              name: null,
              description: null,
              website: null,
              image: null,
              phone: null,
              address: null
            } }
          )
        })

        it('reports duplicate insert', async function () {
          await success(
            validateLocation, {
              forInsert: true, citySlug: 'city-1', location: { slug: 'location-1', name: 'Location Name' }
            },
            { validateLocation: {
              slug: DUPLICATE_LOCATION_SLUG_ERROR,
              name: null,
              description: null,
              website: null,
              image: null,
              phone: null,
              address: null
            } }
          )
        })
      })
    })
  })

  describe('putEvent', function () {
    withCities(function () {
      withLocations(function () {
        withArtists(function () {
          withoutEvents(function () {
            it('creates event with title', async function () {
              await error(
                getEvent, { citySlug: 'city-1', eventId: 'WjnegYbwZ1' },
                'Pas d\'événement avec l\'id "WjnegYbwZ1" dans la ville avec le slug "city-1"'
              )
              await success(
                putEvent, { citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    location: 'location-3',
                    tags: ['tag-1'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { putEvent: { id: 'WjnegYbwZ1' } }
              )
              await success(
                getEvent, { citySlug: 'city-1', eventId: 'WjnegYbwZ1' },
                { city: { event: {
                  id: 'WjnegYbwZ1',
                  title: 'Event Title',
                  artist: null,
                  location: { slug: 'location-3' },
                  tags: [{ slug: 'tag-1' }],
                  occurrences: [{ start: '2019-01-01T12:00' }],
                  reservationPage: null
                } } }
              )
            })

            it('creates event with artist', async function () {
              await error(
                getEvent, { citySlug: 'city-2', eventId: 'WjnegYbwZ1' },
                'Pas d\'événement avec l\'id "WjnegYbwZ1" dans la ville avec le slug "city-2"'
              )
              await success(
                putEvent, { citySlug: 'city-2',
                  event: {
                    artist: 'artist-1',
                    location: 'location-1',
                    tags: ['tag-3'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { putEvent: { id: 'WjnegYbwZ1' } }
              )
              await success(
                getEvent, { citySlug: 'city-2', eventId: 'WjnegYbwZ1' },
                { city: { event: {
                  id: 'WjnegYbwZ1',
                  title: null,
                  artist: { slug: 'artist-1' },
                  location: { slug: 'location-1' },
                  tags: [{ slug: 'tag-3' }],
                  occurrences: [{ start: '2019-01-01T12:00' }],
                  reservationPage: null
                } } }
              )
            })

            it('cannot edit event', async function () {
              await error(
                putEvent, { citySlug: 'city-1',
                  event: {
                    id: 'VolejRejNm',
                    title: 'New Event Title 1.2',
                    artist: 'artist-1',
                    location: 'location-2',
                    tags: ['tag-2', 'tag-3'],
                    occurrences: [{ start: '2019-02-01T12:00' }, { start: '2019-03-01T12:00' }],
                    reservationPage: 'http://google.com/'
                  }
                },
                'Pas d\'événement avec l\'id "VolejRejNm" dans la ville avec le slug "city-1"'
              )
            })
          })

          withEvents(function () {
            it('edits event', async function () {
              await success(
                getEvent, { citySlug: 'city-1', eventId: 'VolejRejNm' },
                { city: { event: {
                  id: 'VolejRejNm',
                  title: 'Event Title 1.2',
                  artist: null,
                  location: { slug: 'location-1' },
                  tags: [{ slug: 'tag-1' }],
                  occurrences: [{ start: '2019-01-01T12:00' }],
                  reservationPage: null
                } } }
              )
              await success(
                putEvent, { citySlug: 'city-1',
                  event: {
                    id: 'VolejRejNm',
                    title: 'New Event Title 1.2',
                    artist: 'artist-1',
                    location: 'location-2',
                    tags: ['tag-2', 'tag-3'],
                    occurrences: [{ start: '2019-02-01T12:00' }, { start: '2019-03-01T12:00' }],
                    reservationPage: 'http://google.com/'
                  }
                },
                { putEvent: { id: 'VolejRejNm' } }
              )
              await success(
                getEvent, { citySlug: 'city-1', eventId: 'VolejRejNm' },
                { city: { event: {
                  id: 'VolejRejNm',
                  title: 'New Event Title 1.2',
                  artist: { slug: 'artist-1' },
                  location: { slug: 'location-2' },
                  tags: [{ slug: 'tag-2' }, { slug: 'tag-3' }],
                  occurrences: [{ start: '2019-02-01T12:00' }, { start: '2019-03-01T12:00' }],
                  reservationPage: 'http://google.com/'
                } } }
              )
            })
          })
        })
      })
    })
  })

  describe('getEvents', function () {
    withCities(function () {
      withLocations(function () {
        withArtists(function () {
          withoutEvents(function () {
            it('finds no events', async function () {
              await success(
                getEvents, { citySlug: 'city-1' },
                { city: { events: [] } }
              )
            })
          })

          withEvents(function () {
            it('finds events', async function () {
              await success(
                getEvents, { citySlug: 'city-1' },
                { city: { events: [{ 'id': 'WjnegYbwZ1' }, { 'id': 'VolejRejNm' }, { 'id': 'Wpmbk5ezJn' }] } }
              )
            })
          })

          it('filters by tag', async function () {
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ok-single', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ok-main', location: 'location-1', tags: ['tag-1', 'tag-2'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ok-secondary', location: 'location-1', tags: ['tag-2', 'tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ko', location: 'location-1', tags: ['tag-2'], occurrences: [{ start: '2018-07-14T12:00' }] } })

            await success(
              getEventTitles, { citySlug: 'city-1', tag: 'tag-1' },
              { city: { events: [{ title: 'ok-single' }, { title: 'ok-main' }, { title: 'ok-secondary' }] } }
            )
          })

          it('filters by location', async function () {
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ok', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ko', location: 'location-2', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })

            await success(
              getEventTitles, { citySlug: 'city-1', location: 'location-1' },
              { city: { events: [{ title: 'ok' }] } }
            )
          })

          it('filters by artist', async function () {
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ok', artist: 'artist-1', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ko', artist: 'artist-2', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })

            await success(
              getEventTitles, { citySlug: 'city-1', artist: 'artist-1' },
              { city: { events: [{ title: 'ok' }] } }
            )
          })

          it('filters by title', async function () {
            await run(putEvent, { citySlug: 'city-1', event: { title: 'name aeiou', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'aeiou name', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'NAME AEIOU', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'name àéïôù', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'name', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'foobar', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: null, artist: 'artist-1', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-14T12:00' }] } })

            await success(
              getEventTitles, { citySlug: 'city-1', title: 'name aeiou' },
              { city: { events: [{ title: 'name aeiou' }, { title: 'aeiou name' }, { title: 'NAME AEIOU' }, { title: 'name àéïôù' }] } }
            )
          })

          it('filters by dates', async function () {
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ko-before', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-13T23:59' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ok-1', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-12T12:00' }, { start: '2018-07-14T00:00' }, { start: '2018-07-16T12:00' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ok-2', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-15T23:59' }] } })
            await run(putEvent, { citySlug: 'city-1', event: { title: 'ko-after', location: 'location-1', tags: ['tag-1'], occurrences: [{ start: '2018-07-16T00:00' }] } })

            await success(
              getEventTitles, { citySlug: 'city-1', dates: { start: '2018-07-14', after: '2018-07-16' } },
              { city: { events: [{ title: 'ok-1' }, { title: 'ok-2' }] } }
            )
          })
        })
      })
    })
  })

  describe('deleteEvent', function () {
    withCities(function () {
      withLocations(function () {
        withArtists(function () {
          withoutEvents(function () {
            it('cannot delete event', async function () {
              await error(
                deleteEvent, { citySlug: 'city-1', eventId: 'nope' },
                'Pas d\'événement avec l\'id "nope" dans la ville avec le slug "city-1"'
              )
            })
          })

          withEvents(function () {
            it('deletes event', async function () {
              await success(
                getEvent, { citySlug: 'city-1', eventId: 'VolejRejNm' },
                { city: { event: {
                  id: 'VolejRejNm',
                  title: 'Event Title 1.2',
                  artist: null,
                  location: { slug: 'location-1' },
                  tags: [{ slug: 'tag-1' }],
                  occurrences: [{ start: '2019-01-01T12:00' }],
                  reservationPage: null
                } } }
              )
              await success(
                deleteEvent, { citySlug: 'city-1', eventId: 'VolejRejNm' },
                { deleteEvent: { id: 'VolejRejNm' } }
              )
              await error(
                getEvent, { citySlug: 'city-1', eventId: 'VolejRejNm' },
                'Pas d\'événement avec l\'id "VolejRejNm" dans la ville avec le slug "city-1"'
              )
            })
          })
        })
      })
    })
  })

  describe('validateEvent', function () {
    withCities(function () {
      withLocations(function () {
        withArtists(function () {
          withoutEvents(function () {
            it('accepts a valid event for insert', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    artist: 'artist-1',
                    location: 'location-1',
                    tags: ['tag-1'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { validateEvent: {
                  id: null, title: null, artist: null, location: null, tags: null, occurrences: null, reservationPage: null
                } }
              )
            })

            it('reports missing title and artist', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    location: 'location-1',
                    tags: ['tag-1'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { validateEvent: {
                  id: null, title: 'Un événement doit avoir un titre ou un artiste.', artist: null, location: null, tags: null, occurrences: null, reservationPage: null
                } }
              )
            })

            it('reports unexisting artist', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    artist: 'artist-0',
                    location: 'location-1',
                    tags: ['tag-1'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { validateEvent: {
                  id: null, title: null, artist: 'Pas d\'artiste avec le slug "artist-0"', location: null, tags: null, occurrences: null, reservationPage: null
                } }
              )
            })

            it('reports null location', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    artist: 'artist-1',
                    location: null,
                    tags: ['tag-1'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { validateEvent: {
                  id: null, title: null, artist: null, location: MISSING_EVENT_LOCATION_ERROR, tags: null, occurrences: null, reservationPage: null
                } }
              )
            })

            it('reports unexisting location', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    artist: 'artist-1',
                    location: 'location-0',
                    tags: ['tag-1'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { validateEvent: {
                  id: null, title: null, artist: null, location: 'Pas de lieu avec le slug "location-0" dans la ville avec le slug "city-1"', tags: null, occurrences: null, reservationPage: null
                } }
              )
            })

            it('reports missing tags', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    artist: 'artist-1',
                    location: 'location-1',
                    tags: [],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { validateEvent: {
                  id: null, title: null, artist: null, location: null, tags: MISSING_EVENT_TAGS_ERROR, occurrences: null, reservationPage: null
                } }
              )
            })

            it('reports unexisting tag', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    artist: 'artist-1',
                    location: 'location-1',
                    tags: ['tag-0'],
                    occurrences: [{ start: '2019-01-01T12:00' }]
                  }
                },
                { validateEvent: {
                  id: null, title: null, artist: null, location: null, tags: 'Pas de catégorie avec le slug "tag-0" dans la ville avec le slug "city-1"', occurrences: null, reservationPage: null
                } }
              )
            })

            it('reports missing occurrences', async function () {
              await success(
                validateEvent, {
                  forInsert: true,
                  citySlug: 'city-1',
                  event: {
                    title: 'Event Title',
                    artist: 'artist-1',
                    location: 'location-1',
                    tags: ['tag-1'],
                    occurrences: []
                  }
                },
                { validateEvent: {
                  id: null, title: null, artist: null, location: null, tags: null, occurrences: MISSING_EVENT_OCCURRENCES_ERROR, reservationPage: null
                } }
              )
            })
          })
        })
      })
    })
  })

  describe('getCityDates', function () {
    withCities(function () {
      withLocations(function () {
        it('returns no date', async function () {
          await success(
            getCityDates, { slug: 'city-1' },
            { city: { slug: 'city-1', firstDate: null, dateAfter: null } }
          )
        })

        it('uses single occurrence from single event', async function () {
          await run(putEvent, make([{ start: '2019-03-19T20:35' }]))

          await success(
            getCityDates, { slug: 'city-1' },
            { city: { slug: 'city-1', firstDate: '2019-03-19', dateAfter: '2019-03-20' } }
          )
        })

        it('uses several occurrences from single event', async function () {
          await run(putEvent, make([{ start: '2019-03-19T20:35' }, { start: '2019-03-12T20:35' }, { start: '2019-03-27T20:35' }]))

          await success(
            getCityDates, { slug: 'city-1' },
            { city: { slug: 'city-1', firstDate: '2019-03-12', dateAfter: '2019-03-28' } }
          )
        })

        it('uses single occurrence from several events', async function () {
          await run(putEvent, make([{ start: '2019-03-19T20:35' }]))
          await run(putEvent, make([{ start: '2019-03-12T20:35' }]))
          await run(putEvent, make([{ start: '2019-03-27T20:35' }]))

          await success(
            getCityDates, { slug: 'city-1' },
            { city: { slug: 'city-1', firstDate: '2019-03-12', dateAfter: '2019-03-28' } }
          )
        })

        function make (occurrences) {
          return { citySlug: 'city-1', event: { title: 'Event Title', location: 'location-1', tags: ['tag-1'], occurrences } }
        }
      })
    })
  })
})
