'use strict'

/* global describe, it */

const assert = require('assert').strict

const datetime = require('../datetime')
const durations = require('./durations')

describe('durations', function () {
  const {oneDay} = durations

  function assertMomentsEqual (a, b) {
    assert(a.isSame(b), 'Expected ' + b.format() + ' but got ' + a.format())
  }

  describe('oneDay', function () {
    it('clips', function () {
      assertMomentsEqual(oneDay.clip(datetime.datetime('2018-07-13T12:34')), datetime.date('2018-07-13'))
    })
  })
})
