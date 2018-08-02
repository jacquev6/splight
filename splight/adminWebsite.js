'use strict'

const browserify = require('browserify')
const express = require('express')
const mustache = require('mustache')
const sass = require('node-sass')

const page = require('./adminWebsite/page')
const publicWebsite = require('./publicWebsite')

function * generateAssets ({scripts}) {
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
    content: new Promise((resolve, reject) =>
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
  }
}

async function makeRouter ({dataDirectory, scripts}) {
  const router = express.Router()

  for (var asset of generateAssets({scripts})) {
    console.log('Preparing to serve', asset.path, 'as', asset.type)
    router.get(asset.path, ((content, type) => async (req, res) => res.type(type).send(content))(await asset.content, asset.type))
  }

  router.use(await publicWebsite.makeRouter({dataDirectory, scripts}))

  return router
}

Object.assign(exports, {makeRouter})
