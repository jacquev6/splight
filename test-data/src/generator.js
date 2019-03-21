'use strict'

const coolstory_ = require('coolstory.js')
const Faker = require('faker/lib')
const fakerLocales = require('faker/lib/locales')
const random = require('random')
const seedrandom = require('seedrandom')

module.exports = function generator (seed) {
  const rng = random.clone(seedrandom(seed))

  function bool (p) {
    return rng.float() < p
  }

  function int (min, max) {
    return rng.int(min, max - 1)
  }

  function pickOne (values) {
    return values[int(0, values.length)]
  }

  function pick (count, values) {
    values = Array.from(values)
    const ret = []
    for (var i = 0; i !== count; ++i) {
      const index = int(0, values.length)
      ret.push(values[index])
      values.splice(index, 1)
    }
    return ret
  }

  function word (len) {
    return [...Array(len).keys()].map(() => pickOne('abcdefghijklmnopqrstuvwxyz')).join('')
  }

  function branch () {
    return generator(`${seed}_${word(5)}`)
  }

  function array (len, f) {
    const b = branch()
    return [...Array(len).keys()].map(() => f(b.branch()))
  }

  function coolstory () {
    rng.patch()
    const ret = coolstory_.title()
    rng.unpatch()
    return ret
  }

  function faker () {
    const faker = new Faker({ locales: fakerLocales })
    faker.seed(int(0, 10000000))
    return faker
  }

  return { bool, int, pick, pickOne, word, coolstory, faker, branch, array }
}
