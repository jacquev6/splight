'use strict'

/* global describe, it */

const assert = require('assert').strict
const moment = require('moment')

const pages = require('./pages')

describe('pages', function () {
  describe('durations', function () {
    const {oneDay} = pages.durations

    function assertMomentsEqual (a, b) {
      assert(a.isSame(b), 'Expected ' + b.format() + ' but got ' + a.format())
    }

    describe('oneDay', function () {
      it('clips', function () {
        assertMomentsEqual(oneDay.clip(moment('2018-07-13T12:34')), moment('2018-07-13'))
      })
    })
  })
})
