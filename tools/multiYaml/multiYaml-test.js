'use strict'

/* global describe, it */

const assert = require('assert').strict
const fs = require('fs')
const path = require('path')

const yaml = require('js-yaml')

const multiYaml = require('.')

describe('multiYaml', function () {
  describe('load', function () {
    fs.readdirSync(path.join(__dirname, 'spec/outputs')).forEach(function (name) {
      const [baseName, status] = name.split('.')
      const inputName = path.join(__dirname, 'spec', 'inputs', baseName)
      const outputName = path.join(__dirname, 'spec', 'outputs', name)
      const expected = yaml.safeLoad(fs.readFileSync(outputName))
      if (status === 'ok') {
        it("should load '" + baseName + "'", function () {
          assert.deepEqual(multiYaml.load(inputName), expected)
        })
      } else {
        it("should fail to load '" + baseName + "'", function () {
          try {
            multiYaml.load(inputName)
          } catch (e) {
            assert.equal(e.message, expected)
            return
          }
          assert.fail('Exception not raised')
        })
      }
    })
  })
})
