'use strict'

/* globals describe, it */

const assert = require('assert').strict

const generator = require('./generator')

describe('generator tests', function () {
  it('generates integers up to bounds', function () {
    const geni = generator('xyz')

    assert.equal(geni.int(3, 8), 4)
    assert.equal(geni.int(3, 8), 5)
    assert.equal(geni.int(3, 8), 7) // upper bound
    assert.equal(geni.int(3, 8), 4)
    assert.equal(geni.int(3, 8), 6)
    assert.equal(geni.int(3, 8), 7)
    assert.equal(geni.int(3, 8), 4)
    assert.equal(geni.int(3, 8), 3) // lower bound

    for (var i = 0; i !== 100; ++i) {
      const r = geni.int(3, 8)
      assert(r >= 3)
      assert(r < 8)
    }
  })

  it('generates arrays with stable prefixes', function () {
    const f = g => g.int(0, 5)

    assert.deepEqual(generator('abcd').array(0, f), [])
    assert.deepEqual(generator('abcd').array(1, f), [3])
    assert.deepEqual(generator('abcd').array(10, f), [3, 2, 3, 1, 2, 3, 3, 1, 0, 3])
    assert.deepEqual(generator('abcd').array(11, f), [3, 2, 3, 1, 2, 3, 3, 1, 0, 3, 0])
  })

  it('picks uniformly', function () {
    const geni = generator('xyz')
    const picked = { a: 0, b: 0, c: 0, d: 0 }
    for (var i = 0; i !== 10000; ++i) {
      ++picked[geni.pickOne('abcd')]
    }
    assert.deepEqual(picked, { a: 2508, b: 2492, c: 2529, d: 2471 })
  })

  it('picks several', function () {
    const geni = generator('xyz')
    const picked = { a: 0, b: 0, c: 0, d: 0 }
    for (var i = 0; i !== 10000; ++i) {
      const p = geni.pick(2, 'abcd')
      assert.notEqual(p[0], p[1])
      ++picked[p[0]]
      ++picked[p[1]]
    }
    assert.deepEqual(picked, { a: 5055, b: 5001, c: 4947, d: 4997 })
  })

  it('generates booleans', function () {
    const geni = generator('abcd')
    const histogram = { true: 0, false: 0 }
    for (var i = 0; i !== 10000; ++i) {
      ++histogram[geni.bool(0.75)]
    }
    assert.deepEqual(histogram, { true: 7461, false: 2539 })
  })

  it('generates coolstories', function () {
    const geni = generator('uvwxyz')
    assert.equal(geni.coolstory(), 'Districts Will Not Start Ship')
    assert.equal(geni.coolstory(), 'Horizon')
    assert.equal(geni.coolstory(), "The Star's Hidden Mazes")
  })

  it('generates fake names', function () {
    const geni = generator('uvwxyz')
    assert.equal(geni.faker().name.findName(), 'Brannon VonRueden')
    assert.equal(geni.faker().name.findName(), 'Arvel Ryan')
    assert.equal(geni.faker().name.findName(), 'Ted Oberbrunner')

    assert.equal(generator('abcd').faker().name.findName(), "Brennan O'Kon")
  })

  it('is not influenced by previous array length', function () {
    const geni1 = generator('abc')
    geni1.array(5, geni => geni.int(0, 100))
    const geni2 = generator('abc')
    geni2.array(10, geni => geni.int(0, 100))

    assert.deepEqual(geni1.array(5, geni => geni.int(0, 100)), geni2.array(5, geni => geni.int(0, 100)))
  })
})
