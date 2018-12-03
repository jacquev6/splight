'use strict'

const browserify = require('browserify')
const express = require('express')
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

async function makeRouter ({dataDirectory, scripts, generationDate}) {
  const router = express.Router()

  const {api, imagesDirectory} = graphqlApi.make({dataDirectory, generationDate, imagesUrlsPrefix: '/images/'})

  for (var asset of generateAssets({scripts, api})) {
    console.log('Preparing to serve', asset.path, 'as', asset.type)
    router.get(asset.path, ((content, type) => async (req, res) => res.type(type).send(content))(await asset.content, asset.type))
  }

  router.use(await publicWebsite.makeRouter({api, imagesDirectory, scripts, generationDate}))

  return router
}

Object.assign(exports, {makeRouter})
