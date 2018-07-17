'use strict'

const browserify = require('browserify')
const moment = require('moment')
const mustache = require('mustache')
const path = require('path')
const sass = require('node-sass')
const util = require('util')

const publicWebsite = require('./publicWebsite')
const data_ = require('./data')

exports.populateApp = async function ({app, inputDataFile, scripts}) {
  const now = moment().subtract(2, 'days') // Simulate a site generated 2 days ago
  const data = await data_.load(inputDataFile)

  for (var [name, content] of publicWebsite.generate({data, now, scripts})) {
    const type = name.endsWith('/') ? '.html' : path.extname(name)
    const text = await content
    app.get(name.replace('+', '\\+'), (req, res) => res.type(type).send(text))
  }

  (function () {
    const text = mustache.render(require('./adminWebsite/index.html'), {scripts})
    app.get('/admin/', (req, res) => res.type('.html').send(text))
  }())

  await (async function () {
    const text = await util.promisify(cb => browserify('splight/adminWebsite/index.js').bundle(cb))()
    app.get('/admin/index.js', (req, res) => res.type('.js').send(text))
  }())

  await (async function () {
    const text = (await util.promisify(cb => sass.render({file: 'splight/adminWebsite/index.scss'}, cb))()).css
    app.get('/admin/index.css', (req, res) => res.type('.css').send(text))
  }())
}
