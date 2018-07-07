'use strict'
/* global describe, it */
const assert = require('assert').strict

const moment = require('moment')

const splightUrls = require('./splight-urls')

describe('splight-url', function () {
  describe('makeCity', function () {
    it('creates a brand new city URL', function () {
      assert.equal(
        splightUrls.makeCity({city: 'city'}),
        '/city/'
      )
    })
    it('changes just the city in a full city URL', function () {
      assert.equal(
        splightUrls.makeCity({url: 'http://splight.fr/foo/?query=1&string=2#fragment', city: 'city'}),
        'http://splight.fr/city/?query=1&string=2#fragment'
      )
    })
  })

  describe('makeWeek', function () {
    it('adds the timespan to a city URL', function () {
      assert.equal(
        splightUrls.makeWeek({url: '/city/', week: moment('2018-01-04')}),
        '/city/2018-W01/'
      )
    })
    it('creates a brand new week URL', function () {
      assert.equal(
        splightUrls.makeWeek({city: 'city', week: moment('2018-01-11')}),
        '/city/2018-W02/'
      )
    })
    it('changes just the timespan in a full timespan URL', function () {
      assert.equal(
        splightUrls.makeWeek({url: 'http://splight.fr/city/timespan/?query=1&string=2#fragment', week: moment('2018-01-18')}),
        'http://splight.fr/city/2018-W03/?query=1&string=2#fragment'
      )
    })
  })
})