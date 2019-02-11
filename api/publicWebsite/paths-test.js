'use strict'

/* global describe, it */

const assert = require('assert').strict

const datetime = require('../datetime')
const durations = require('./durations')
const paths = require('./paths')

describe('paths', function () {
  describe('root', function () {
    it('works', function () {
      assert.equal(paths.root(), '/')
    })
  })

  describe('city', function () {
    it('works', function () {
      assert.equal(paths.city('slug'), '/slug/')
    })
  })

  describe('timespan', function () {
    const startDate = datetime.date('2004-01-02')
    it('works for oneWeek', function () {
      assert.equal(paths.timespan('slug', startDate, durations.oneWeek), '/slug/2004-W01/')
    })
    it('works for threeDays', function () {
      assert.equal(paths.timespan('slug', startDate, durations.threeDays), '/slug/2004-01-02+2/')
    })
    it('works for oneDay', function () {
      assert.equal(paths.timespan('slug', startDate, durations.oneDay), '/slug/2004-01-02/')
    })
  })
})
