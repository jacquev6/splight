'use strict'

/* globals describe, context, it */

const assert = require('assert') // Not strict because graphql's returned data doesn't have Object prototype

const graphqlApi = require('./graphqlApi')

describe('graphqlApi', function () {
  function run (data, save, requestString) {
    return graphqlApi.make({load: () => Promise.resolve(data), save}).request({requestString})
  }

  function test (data, requestString, expected) {
    return async function () {
      assert.deepEqual(
        await run(data, async () => undefined, requestString),
        expected
      )
    }
  }

  context('with empty data', function () {
    const data = {
      artists: {},
      cities: []
    }

    it('returns no cities', test(data, '{ cities { slug } }', {data: {cities: []}}))

    it('returns no city', test(data, '{ city(slug:"foo") { slug } }', {data: {city: null}}))
  })

  context('with several empty cities', function () {
    const data = {
      artists: {},
      cities: [
        {
          slug: 'foo',
          name: 'Foo',
          locations: {},
          tags: [],
          events: []
        },
        {
          slug: 'baz',
          name: 'Baz',
          locations: {},
          tags: [],
          events: []
        },
        {
          slug: 'bar',
          name: 'Bar',
          locations: {},
          tags: [],
          events: []
        }
      ]
    }

    it('returns cities', test(data, '{cities{slug}}', {data: {cities: [{slug: 'foo'}, {slug: 'baz'}, {slug: 'bar'}]}}))

    it('returns city foo', test(data, '{city(slug:"foo"){slug}}', {data: {city: {slug: 'foo'}}}))
    it('returns city bar', test(data, '{city(slug:"bar"){slug}}', {data: {city: {slug: 'bar'}}}))
    it('returns city baz', test(data, '{city(slug:"baz"){slug}}', {data: {city: {slug: 'baz'}}}))
  })

  context('with a single full city', function () {
    const data = {
      artists: {
        'artist-1': {name: 'Artist 1'},
        'artist-3': {name: 'Artist 3'},
        'artist-2': {name: 'Artist 2'}
      },
      cities: [{
        slug: 'foo',
        name: 'Foo',
        locations: {
          'location-1': {name: 'Location 1'},
          'location-3': {name: 'Location 3'},
          'location-2': {name: 'Location 2'}
        },
        tags: [
          {slug: 'tag-1', title: 'Tag 1'},
          {slug: 'tag-3', title: 'Tag 3'},
          {slug: 'tag-2', title: 'Tag 2'}
        ],
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
      }]
    }

    it('returns tags', test(data, '{cities{tags{slug title}}}', {data: {cities: [{tags: [
      {slug: 'tag-1', title: 'Tag 1'},
      {slug: 'tag-3', title: 'Tag 3'},
      {slug: 'tag-2', title: 'Tag 2'}
    ]}]}}))

    it('returns dates', test(data, '{cities{firstDate dateAfter}}', {data: {cities: [{
      firstDate: '2018-07-12', dateAfter: '2018-07-16'
    }]}}))

    it('returns days', test(data, '{cities{days(first:"2018-07-01", after:"2018-07-04"){date}}}', {data: {cities: [{days: [
      {date: '2018-07-01'},
      {date: '2018-07-02'},
      {date: '2018-07-03'}
    ]}]}}))

    it('returns events', test(data, '{cities{days(first:"2018-07-12", after:"2018-07-16"){date events{time title}}}}', {data: {cities: [{days: [
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

    it('returns locations',
      test(
        data,
        '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{location{slug name}}}}}',
        {data: {cities: [{days: [{events: [{location: {slug: 'location-1', name: 'Location 1'}}]}]}]}}
      )
    )

    it('returns artists',
      test(
        data,
        '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{artist{slug name}}}}}',
        {data: {cities: [{days: [{events: [{artist: {slug: 'artist-2', name: 'Artist 2'}}]}]}]}}
      )
    )

    it('returns null artist',
      test(
        data,
        '{cities{days(first:"2018-07-15", after:"2018-07-16"){events{artist{slug name}}}}}',
        {data: {cities: [{days: [{events: [{artist: null}]}]}]}}
      )
    )

    it('returns event mainTag',
      test(
        data,
        '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{mainTag{slug title}}}}}',
        {data: {cities: [{days: [{events: [{mainTag: {slug: 'tag-3', title: 'Tag 3'}}]}]}]}}
      )
    )

    it('returns event tags',
      test(
        data,
        '{cities{days(first:"2018-07-14", after:"2018-07-15"){events{tags{slug title}}}}}',
        {data: {cities: [{days: [{events: [{tags: [{slug: 'tag-3', title: 'Tag 3'}, {slug: 'tag-2', title: 'Tag 2'}]}]}]}]}}
      )
    )
  })
})
