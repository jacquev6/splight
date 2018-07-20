'use strict'

require('stringify').registerWithRequire(['.html'])

/* global describe, it */

const assert = require('assert').strict
const moment = require('moment')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const source_ = require('./source')

function assertMomentsEqual (a, b) {
  assert(a.isSame(b), 'Expected ' + b.format() + ' but got ' + a.format())
}

describe('source', function () {
  const now = moment('2018-07-12T12:34')

  const source = source_.make({
    fetcher: {
      cities: Promise.resolve([
        {slug: 'city1', name: 'City 1', tags: [], ignored: 42},
        {slug: 'city3', name: 'City 3', tags: []},
        {
          slug: 'city2',
          name: 'City 2',
          tags: [
            {slug: 'tag1', title: 'Tag 1', ignored: 42},
            {slug: 'tag3', title: 'Tag 3'},
            {slug: 'tag2', title: 'Tag 2'}
          ]
        }
      ]),

      getCityWeek: async function (citySlug, week) {
        const cityWeeks = {}

        cityWeeks['city2-2018-W29'] = {events: [
          {start: '2018-07-16T00:00', title: 'Event 1', tags: ['tag1'], ignored: 42},
          {start: '2018-07-22T23:59', title: 'Event 2', tags: ['tag1', 'tag2']}
        ]}

        cityWeeks['city2-2018-W30'] = {events: [
          {start: '2018-07-23T00:00', title: 'Event 3', tags: ['tag1']},
          {start: '2018-07-29T23:59', title: 'Event 4', tags: ['tag1', 'tag2']}
        ]}

        return cityWeeks[citySlug + '-' + week.format(moment.HTML5_FMT.WEEK)]
      }
    },
    now
  })

  it('returns now', function () {
    assertMomentsEqual(source.getNow(), now)
  })

  it('returns cities', async function () {
    assert.deepEqual(
      await source.getCities(),
      [
        {slug: 'city1', name: 'City 1'},
        {slug: 'city3', name: 'City 3'},
        {slug: 'city2', name: 'City 2'}
      ]
    )
  })

  it('returns city by slug', async function () {
    assert.deepEqual(
      await source.getCity('city2'),
      {
        slug: 'city2',
        name: 'City 2',
        tags: [
          {slug: 'tag1', title: 'Tag 1'},
          {slug: 'tag3', title: 'Tag 3'},
          {slug: 'tag2', title: 'Tag 2'}
        ]
      }
    )
  })

  it('returns events for a single full week', async function () {
    assert.deepEqual(
      await source.getEvents('city2', moment('2018-07-16'), moment('2018-07-23')),
      [
        {
          start: moment('2018-07-16T00:00', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 1',
          tags: ['tag1']
        },
        {
          start: moment('2018-07-22T23:59', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 2',
          tags: ['tag1', 'tag2']
        }
      ]
    )
  })

  it('returns events for two full weeks', async function () {
    assert.deepEqual(
      await source.getEvents('city2', moment('2018-07-16'), moment('2018-07-30')),
      [
        {
          start: moment('2018-07-16T00:00', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 1',
          tags: ['tag1']
        },
        {
          start: moment('2018-07-22T23:59', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 2',
          tags: ['tag1', 'tag2']
        },
        {
          start: moment('2018-07-23T00:00', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 3',
          tags: ['tag1']
        },
        {
          start: moment('2018-07-29T23:59', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 4',
          tags: ['tag1', 'tag2']
        }
      ]
    )
  })

  it('filter events from two partial weeks', async function () {
    assert.deepEqual(
      await source.getEvents('city2', moment('2018-07-22'), moment('2018-07-24')),
      [
        {
          start: moment('2018-07-22T23:59', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 2',
          tags: ['tag1', 'tag2']
        },
        {
          start: moment('2018-07-23T00:00', moment.HTML5_FMT.DATETIME_LOCAL, true),
          title: 'Event 3',
          tags: ['tag1']
        }
      ]
    )
  })
})
