'use strict'

// const assert = require('assert').strict
const browserify = require('browserify')
const CleanCSS = require('clean-css')
const express = require('express')
const expressGraphql = require('express-graphql')
const graphql = require('graphql')
const htmlMinifier = require('html-minifier')
const modernizr = require('modernizr')
// const moment = require('moment')
// const neatJSON = require('neatjson').neatJSON
const path = require('path')
const sass = require('node-sass')
const terser = require('terser')
// const XmlSitemap = require('xml-sitemap')

const container = require('./publicWebsite/widgets/container')
const data_ = require('./data')
// const durations = require('./publicWebsite/durations')
const graphqlApi = require('./graphqlApi')
const pages = require('./publicWebsite/pages')

async function makeRouter ({dataDirectory, scripts}) {
  const router = express.Router()

  const schema = graphqlApi.schema
  const rootValue = graphqlApi.makeRoot({load: () => data_.load(path.join(dataDirectory, 'data.json'))})
  router.use('/graphql', expressGraphql({schema, rootValue, graphiql: true}))
  function query (requestString, variableValues) {
    return graphql.graphql(schema, requestString, rootValue, undefined, variableValues)
  }

  for (var [name, content] of generateAssets({indexJsFlavor: 'serve'})) {
    const type = path.extname(name)
    console.log('Preparing to serve', name, 'as', type)
    router.get(name, (content => async (req, res) => res.type(type).send(content))(await content))
  }

  for (var pageClass of generatePageClasses({query, scripts})) {
    console.log('Ready to serve', pageClass.path)
    router.get(pageClass.path, pageClass.handler)
  }

  router.use(express.static(path.join(dataDirectory, 'images')))

  return router
}

function * generateAssets ({indexJsFlavor}) {
  const modernizrFeatures = [
    ['test/es6/arrow'],
    ['test/es6/collections', 'es6collections'],
    ['test/hashchange'],
    ['test/history'],
    ['test/canvas']
  ]

  yield makeRobotsTxt()
  yield makeModernizerJs({modernizrFeatures})
  yield makeIndexJs({indexJsFlavor})
  yield makeIndexCss({modernizrFeatures})
}

function makeRobotsTxt () {
  return ['/robots.txt', Promise.resolve('Sitemap: https://splight.fr/sitemap.xml\n\nUser-agent: *\nAllow: /\n')]
}

function makeModernizerJs ({modernizrFeatures}) {
  return [
    '/modernizr.js',
    new Promise((resolve, reject) =>
      modernizr.build(
        {
          'minify': false,
          'classPrefix': 'mdrn-',
          'options': [
            'domPrefixes',
            'prefixes',
            'addTest',
            'atRule',
            'hasEvent',
            'mq',
            'prefixed',
            'prefixedCSS',
            'prefixedCSSValue',
            'testAllProps',
            'testProp',
            'testStyles',
            'html5shiv',
            'setClasses'
          ],
          'feature-detects': Array.from(modernizrFeatures.map(([detect]) => detect))
        },
        function (result) {
          resolve(terser.minify(result).code)
        }
      )
    )
  ]
}

function makeIndexJs ({indexJsFlavor}) {
  return [
    '/index.js',
    new Promise((resolve, reject) =>
      browserify('splight/publicWebsite/assets/index-' + indexJsFlavor + '.js')
        .transform('stringify', ['.html'])
        .transform('unassertify')
        .transform('uglifyify', {global: true})
        .bundle(function (error, result) {
          if (error) {
            reject(error)
          } else {
            resolve(result)
          }
        })
    )
  ]
}

function makeIndexCss ({modernizrFeatures}) {
  return [
    '/index.css',
    new Promise((resolve, reject) =>
      sass.render(
        {
          data: '$modernizr-features: "' + modernizrFeatures.map(([detect, feature]) => '.mdrn-' + (feature || detect.split('/').slice(-1)[0])).join('') + '";\n\n@import "splight/publicWebsite/assets/index.scss"'
        },
        function (error, result) {
          if (error) {
            reject(error)
          } else {
            resolve(new CleanCSS({}).minify(result.css).styles)
          }
        }
      )
    )
  ]
}

function * generatePageClasses ({query, scripts}) {
  async function serve (page, res, next) {
    if (page) {
      const response = await query(page.dataRequest.requestString, page.dataRequest.variableValues)
      console.log('GraphQL error(s)', response.errors || response.error)
      if (page.exists(response.data)) {
        console.log('Serving ' + page.path + ' as .html')
        res.type('.html')
        res.send(htmlMinifier.minify(container.make({page, scripts}).render(response.data), {collapseWhitespace: true}))
        return
      }
    }
    next('route')
  }

  yield {
    path: '/',
    handler: (req, res, next) => serve(pages.root(), res, next)
  }

  yield {
    path: '/:city/',
    handler: async (req, res, next) => serve(pages.city(req.params.city), res, next)
  }

  yield {
    path: '/:city/:timespan/',
    handler: async (req, res, next) => serve(pages.timespan.ofSlugs(req.params.city, req.params.timespan), res, next)
  }
}

Object.assign(exports, {makeRouter})
