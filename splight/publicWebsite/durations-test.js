'use strict'

require('stringify').registerWithRequire(['.html'])

/* global describe, it */

const assert = require('assert').strict
const moment = require('moment')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const durations = require('./durations')

describe('durations', function () {
  const {oneDay} = durations

  function assertMomentsEqual (a, b) {
    assert(a.isSame(b), 'Expected ' + b.format() + ' but got ' + a.format())
  }

  describe('oneDay', function () {
    it('clips', function () {
      assertMomentsEqual(oneDay.clip(moment('2018-07-13T12:34')), moment('2018-07-13'))
    })
  })
})
