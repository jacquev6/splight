'use strict'

require('stringify').registerWithRequire(['.html'])

/* global describe, it */

const assert = require('assert').strict
const moment = require('moment')
const path = require('path')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

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
          [{slug: 'foo', name: 'Foo', tags: []}]
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
            {slug: 'foo', name: 'Foo', tags: []},
            {slug: 'bar', name: 'Bar', tags: []},
            {slug: 'baz', name: 'Baz', tags: []}
          ]
        )
      })

      it('loads single tag', function () {
        test(
          {cities: [{slug: 'foo', name: 'Foo', tags: [{slug: 'bar', title: 'Bar'}]}]},
          [{slug: 'foo', name: 'Foo', tags: [{slug: 'bar', title: 'Bar'}]}]
        )
      })

      it('keeps tags in order', function () {
        test(
          {cities: [{
            slug: 'foo',
            name: 'Foo',
            tags: [
              {slug: 'foo', title: 'Foo'}, {slug: 'bar', title: 'Bar'}, {slug: 'baz', title: 'Baz'}
            ]
          }]},
          [{
            slug: 'foo',
            name: 'Foo',
            tags: [
              {slug: 'foo', title: 'Foo'},
              {slug: 'bar', title: 'Bar'},
              {slug: 'baz', title: 'Baz'}
            ]
          }]
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
