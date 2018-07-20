'use strict'

require('stringify').registerWithRequire(['.html'])

/* global describe, it */

const assert = require('assert').strict
const moment = require('moment')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

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
    const startDate = moment('2004-01-02')
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
