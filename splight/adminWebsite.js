'use strict'

const browserify = require('browserify')
const express = require('express')
const fs = require('fs-extra')
const mongodb = require('mongodb')
const path = require('path')
const sass = require('node-sass')

const graphqlApi = require('./graphqlApi')
const page = require('./adminWebsite/page')
const publicWebsite = require('./publicWebsite')
const tagColoring = require('./tagColoring')

function * generateAssets ({scripts, api}) {
  yield {
    path: '/admin/',
    type: '.html',
    content: page.render({scripts})
  }

  yield {
    path: '/admin/index.js',
    type: '.js',
    content: new Promise((resolve, reject) =>
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
  }

  yield {
    path: '/admin/index.css',
    type: '.css',
    content: makeIndexCss({api})
  }
}

async function makeIndexCss ({api}) {
  const sassData = []

  for (var line of tagColoring.makeSassPreamble({cities: (await api.request({requestString: 'query{cities{slug tags{slug}}}'})).data.cities})) {
    sassData.push(line)
  }

  sassData.push('@import "splight/adminWebsite/assets/index.scss";')

  return new Promise((resolve, reject) =>
    sass.render(
      {data: sassData.join('\n')},
      function (error, result) {
        if (error) {
          reject(error)
        } else {
          resolve(result.css)
        }
      }
    )
  )
}

function images (imagesDirectory) {
  function p (fileName) {
    return path.join(imagesDirectory, fileName)
  }

  // @todo Should we cache results? (and update the cache in save and del)
  function exists (fileName) {
    return fs.exists(p(fileName))
  }

  function save (fileName, data) {
    return fs.outputFile(p(fileName), data)
  }

  function del (fileName) {
    return fs.remove(p(fileName))
  }

  return {exists, save, del, prefix: '/images/'}
}

async function makeRouter ({scripts}) {
  const router = express.Router()

  const client = await mongodb.MongoClient.connect('mongodb://splight-mongo:27017/', {useNewUrlParser: true})
  const db = client.db('splight')
  const imagesDirectory = 'test-data/images'
  const api = await graphqlApi.make({db, images: images(imagesDirectory)})

  for (var asset of generateAssets({scripts, api})) {
    console.log('Preparing to serve', asset.path, 'as', asset.type)
    router.get(asset.path, ((content, type) => async (req, res) => res.type(type).send(content))(await asset.content, asset.type))
  }

  router.use(await publicWebsite.makeRouter({api, imagesDirectory, scripts}))

  return router
}

Object.assign(exports, {makeRouter})
