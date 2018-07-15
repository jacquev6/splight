'use strict'

/* global describe, it */

const assert = require('assert').strict
const path = require('path')

const moment = require('moment')

const publicWebsite = require('./publicWebsite').forTest

describe('publicWebsite', function () {
  describe('prepareData', function () {
    const now = moment('2018-06-01', 'YYYY-MM-DD', true)

    describe('cities', function () {
      function test (data, expected) {
        assert.deepEqual(publicWebsite.prepareData({data, now})['cities'], expected)
      }

      it('loads empty data', function () {
        test({}, [])
      })

      it('loads empty city', function () {
        test(
          {cities: {foo: {name: 'Foo'}}},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-06-01', tags: []}]
        )
      })

      it('orders cities by displayOrder', function () {
        test(
          {cities: {
            baz: {name: 'Baz', tags: {}, events: {}, displayOrder: 3},
            foo: {name: 'Foo', tags: {}, events: {}, displayOrder: 1},
            bar: {name: 'Bar', tags: {}, events: {}, displayOrder: 2}
          }},
          [
            {slug: 'foo', name: 'Foo', firstDate: '2018-06-01', tags: []},
            {slug: 'bar', name: 'Bar', firstDate: '2018-06-01', tags: []},
            {slug: 'baz', name: 'Baz', firstDate: '2018-06-01', tags: []}
          ]
        )
      })

      it('orders tags by displayOrder', function () {
        test(
          {cities: {foo: {name: 'Foo',
            tags: {
              foo: {title: 'Foo', displayOrder: 1},
              baz: {title: 'Baz', displayOrder: 3},
              bar: {title: 'Bar', displayOrder: 2}
            }}}},
          [{slug: 'foo',
            name: 'Foo',
            firstDate: '2018-06-01',
            tags: [
              {slug: 'foo', title: 'Foo'},
              {slug: 'bar', title: 'Bar'},
              {slug: 'baz', title: 'Baz'}
            ]}]
        )
      })

      it('gets firstDate from single event before now', function () {
        test(
          {cities: {foo: {name: 'Foo', events: {tag: [{start: '2018/05/15 10:15'}]}}}},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-05-15', tags: []}]
        )
      })

      it('gets firstDate when all events are after now', function () {
        test(
          {cities: {foo: {name: 'Foo', events: {tag: [{start: '2018/06/15 10:15'}]}}}},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-06-01', tags: []}]
        )
      })

      it('gets firstDate earliest occurence of single event', function () {
        test(
          {cities: {foo: {name: 'Foo',
            events: {tag: [{occurences: [
              {start: '2018/05/16 10:15'},
              {start: '2018/05/15 10:15'},
              {start: '2018/05/17 10:15'}
            ]}]}}}},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-05-15', tags: []}]
        )
      })

      it('gets firstDate from earliest event in same tag', function () {
        test(
          {cities: {foo: {name: 'Foo',
            events: {tag: [
              {start: '2018/05/16 10:15'},
              {start: '2018/05/15 10:15'},
              {start: '2018/05/17 10:15'}
            ]}}}},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-05-15', tags: []}]
        )
      })

      it('gets firstDate from earliest event accross tags', function () {
        test(
          {cities: {foo: {name: 'Foo',
            events: {
              tag1: [{start: '2018/05/16 10:15'}],
              tag2: [{start: '2018/05/15 10:15'}],
              tag3: [{start: '2018/05/17 10:15'}]
            }}}},
          [{slug: 'foo', name: 'Foo', firstDate: '2018-05-15', tags: []}]
        )
      })
    })

    describe('week', function () {
      function test (events, week, expected) {
        const data = {cities: {foo: {name: 'Foo', events}}}
        assert.deepEqual(publicWebsite.prepareData({data, now})[path.join('foo', week)], expected)
      }

      it('loads a single event', function () {
        test(
          {bar: [{title: 'Title', start: '2018/06/13 15:00'}]},
          '2018-W24',
          {events: [{title: 'Title', start: '2018/06/13 15:00', tags: ['bar']}]}
        )
      })

      it('filters events', function () {
        const events = {bar: [{title: 'Title', start: '2018/06/13 15:00'}]}

        test(events, '2018-W22', {events: []})
        test(events, '2018-W23', {events: []})
        test(events, '2018-W24', {events: [{title: 'Title', start: '2018/06/13 15:00', tags: ['bar']}]})
        test(events, '2018-W25', {events: []})
        test(events, '2018-W26', {events: []})
      })

      it('adds main tag in front of other tags', function () {
        test(
          {bar: [{title: 'Title', start: '2018/06/13 15:00', tags: ['foo', 'baz']}]},
          '2018-W24',
          {events: [{title: 'Title', start: '2018/06/13 15:00', tags: ['bar', 'foo', 'baz']}]}
        )
      })
    })
  })
})
