'use strict'

/* global describe, it */

const assert = require('assert').strict
const path = require('path')

const moment = require('moment')

const publicWebsite = require('./publicWebsite').forTest

describe('publicWebsite', function () {
  describe('prepareData', function () {
    const now = moment('2018-06-01', moment.HTML5_FMT.DATE, true)

    describe('cities', function () {
      function test (data, expected) {
        assert.deepEqual(publicWebsite.prepareData({data, now})['cities'], expected)
      }

      it('loads empty data', function () {
        test({}, [])
      })

      it('loads empty city', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo'}]},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-06-01', tags: []}]
        )
      })

      it('keeps cities in order', function () {
        test(
          {cities: [
            {slug: 'foo', name: 'Foo'},
            {slug: 'bar', name: 'Bar'},
            {slug: 'baz', name: 'Baz'}
          ]},
          [
            {slug: 'foo', name: 'Foo', firstDate: '2018-06-01', tags: []},
            {slug: 'bar', name: 'Bar', firstDate: '2018-06-01', tags: []},
            {slug: 'baz', name: 'Baz', firstDate: '2018-06-01', tags: []}
          ]
        )
      })

      it('loads single tag', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo', tags: [{slug: 'bar', title: 'Bar'}]}]},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-06-01', tags: [{slug: 'bar', title: 'Bar'}]}]
        )
      })

      it('keeps tags in order', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo',
            tags: [
              {slug: 'foo', title: 'Foo'},
              {slug: 'bar', title: 'Bar'},
              {slug: 'baz', title: 'Baz'}
            ]
          }]},
          [{slug: 'foo',
            name: 'Foo',
            firstDate: '2018-06-01',
            tags: [
              {slug: 'foo', title: 'Foo'},
              {slug: 'bar', title: 'Bar'},
              {slug: 'baz', title: 'Baz'}
            ]
          }]
        )
      })

      it('gets firstDate from single event before now', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo', events: [{occurences: [{start: '2018-05-15T10:15'}]}]}]},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-05-15', tags: []}]
        )
      })

      it('gets firstDate=now when all events are after now', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo', events: [{occurences: [{start: '2018-06-15T10:15'}]}]}]},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-06-01', tags: []}]
        )
      })

      it('gets firstDate from earliest occurence', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo',
            events: [{occurences: [
              {start: '2018-05-16T10:15'},
              {start: '2018-05-15T10:15'},
              {start: '2018-05-17T10:15'}
            ]}]
          }]},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-05-15', tags: []}]
        )
      })

      it('gets firstDate from earliest event', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo', events: [
            {occurences: [{start: '2018-05-16T10:15'}]},
            {occurences: [{start: '2018-05-15T10:15'}]},
            {occurences: [{start: '2018-05-17T10:15'}]}
          ]}]},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-05-15', tags: []}]
        )
      })
    })

    describe('week', function () {
      function test (events, week, expected) {
        const data = {cities: [{slug: 'foo', name: 'Foo', events}]}
        assert.deepEqual(publicWebsite.prepareData({data, now})[path.join('foo', week)], expected)
      }

      it('loads empty event', function () {
        test(
          [{}],
          '2018-W22',
          {events: []}
        )
      })

      it('loads a single event', function () {
        test(
          [{title: 'Title', occurences: [{start: '2018-06-13T15:00'}], tags: ['bar', 'baz']}],
          '2018-W24',
          {events: [{title: 'Title', start: '2018-06-13T15:00', tags: ['bar', 'baz']}]}
        )
      })

      it('filters events', function () {
        const events = [{title: 'Title', occurences: [{start: '2018-06-13T15:00'}], tags: ['bar']}]

        test(events, '2018-W22', {events: []})
        test(events, '2018-W23', {events: []})
        test(events, '2018-W24', {events: [{title: 'Title', start: '2018-06-13T15:00', tags: ['bar']}]})
        test(events, '2018-W25', {events: []})
        test(events, '2018-W26', {events: []})
      })
    })
  })
})
