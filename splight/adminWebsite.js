'use strict'

const browserify = require('browserify')
const express = require('express')
const moment = require('moment')
const mustache = require('mustache')
const path = require('path')
const sass = require('node-sass')
const util = require('util')

const data_ = require('./data')
const durations = require('./publicWebsite/durations')
const indexTemplate = require('./adminWebsite/index.html')
const paths = require('./publicWebsite/paths')
const publicWebsite = require('./publicWebsite')

function addRoutes (router, routes) {
  const contents = []
  for (var [name, content] of routes) {
    const type = name.endsWith('/') ? '.html' : path.extname(name)
    contents.push(content)
    router.get(name.replace('+', '\\+'), (content => (async (req, res) => res.type(type).send(await content)))(content))
  }
  return Promise.all(contents)
}

exports.populateApp = async function ({app, inputDataFile, scripts}) {
  const now = moment().subtract(2, 'days') // Simulate a site generated 2 days ago
  const data = await data_.load(inputDataFile)

  await addRoutes(app, publicWebsite.generateConstants())

  var router = express.Router()
  // https://github.com/expressjs/express/issues/2596
  app.use(function (req, res, next) {
    router(req, res, next)
  })
  await addRoutes(router, publicWebsite.generateDataDependent({data, now, scripts}))

  ;(function () {
    const text = mustache.render(indexTemplate, {scripts})
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

  app.post('/admin/api/cities/avalon/events/', async function (req, res) {
    const start = moment()
    const event = {
      occurences: [
        {start: start.format(moment.HTML5_FMT.DATETIME_LOCAL)}
      ],
      title: 'Foo bar baz',
      tags: ['tag-1'],
      location: 'location-1'
    }
    data.cities[1].events.push(event)
    data_.dump(data, inputDataFile)

    router = express.Router()
    addRoutes(router, publicWebsite.generateDataDependent({data, now, scripts}))

    res.redirect('/admin/?public=' + paths.timespan('avalon', start, durations.oneWeek))
  })
}
