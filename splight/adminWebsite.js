'use strict'

const browserify = require('browserify')
const express = require('express')
const expressGraphql = require('express-graphql')
const moment = require('moment')
const mustache = require('mustache')
const path = require('path')
const sass = require('node-sass')

const body = require('./adminWebsite/body')
const data_ = require('./data')
const graphqlApi = require('./graphqlApi')
const publicWebsite = require('./publicWebsite')
const restApiServer = require('./adminWebsite/restApiServer')
const template = require('./adminWebsite/assets/index.html')

function * generateAssets ({scripts}) {
  yield [
    '/admin/',
    mustache.render(
      template,
      {
        scripts,
        body: body.make({scripts})
      }
    )
  ]

  yield [
    '/admin/index.js',
    new Promise((resolve, reject) =>
      browserify('splight/adminWebsite/assets/index.js')
        .transform('stringify', ['.html'])
        .bundle(function (error, result) {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
    )
  ]

  yield [
    '/admin/index.css',
    new Promise((resolve, reject) =>
      sass.render(
        {file: 'splight/adminWebsite/assets/index.scss'},
        function (error, result) {
          if (error) {
            reject(error)
          } else {
            resolve(result.css)
          }
        }
      )
    )
  ]
}

function addPrecomputedDocuments (router, routes) {
  const contents = []
  for (var [name, content] of routes) {
    const type = name.endsWith('/') ? '.html' : path.extname(name)
    contents.push(content)
    router.get(name.replace('+', '\\+'), (content => async (req, res) => res.type(type).send(await content))(content))
  }
  return Promise.all(contents)
}

async function populateApp ({app, inputDataFile, scripts}) {
  const now = moment().subtract(2, 'days') // Simulate a site generated 2 days ago

  await addPrecomputedDocuments(app, generateAssets({scripts}))
  await addPrecomputedDocuments(app, publicWebsite.generateConstants())

  var router = null
  app.use(function (req, res, next) { router(req, res, next) }) // https://github.com/expressjs/express/issues/2596

  const data = await data_.load(inputDataFile)
  function handleDataChange () {
    data_.dump(data, inputDataFile)
    router = express.Router()
    return addPrecomputedDocuments(router, publicWebsite.generateDataDependent({data, now, scripts}))
  }
  await handleDataChange()

  restApiServer.populateApp({
    app,
    handleDataChange,
    data
  })

  const schema = graphqlApi.schema

  const rootValue = graphqlApi.makeRoot({
    load: () => data_.load(inputDataFile),
    save: undefined // data => data_.dump(data, inputDataFile)
  })

  app.use('/graphql', expressGraphql({schema, rootValue, graphiql: true}))
}

exports.populateApp = populateApp
