'use strict'

const assert = require('assert').strict
const browserify = require('browserify')
const CleanCSS = require('clean-css')
const express = require('express')
const expressGraphql = require('express-graphql')
const fs = require('fs-extra')
const graphql = require('graphql')
const htmlMinifier = require('html-minifier')
const modernizr = require('modernizr')
const moment = require('moment')
const path = require('path')
const sass = require('node-sass')
const terser = require('terser')
// const XmlSitemap = require('xml-sitemap')

const container = require('./publicWebsite/widgets/container')
const data_ = require('./data')
const durations = require('./publicWebsite/durations')
const graphqlApi = require('./graphqlApi')
const pages = require('./publicWebsite/pages')

async function makeRouter ({dataDirectory, scripts}) {
  const schema = graphqlApi.schema
  const rootValue = graphqlApi.makeRoot({load: () => data_.load(path.join(dataDirectory, 'data.json'))})
  function query (requestString, variableValues) {
    return graphql.graphql(schema, requestString, rootValue, undefined, variableValues)
  }

  const router = express.Router()

  router.use(express.static(path.join(dataDirectory, 'images')))

  for (var asset of generateAssets({indexJsFlavor: 'serve'})) {
    const type = path.extname(asset.path)
    console.log('Preparing to serve', asset.path, 'as', type)
    router.get(asset.path, (content => async (req, res) => res.type(type).send(content))(await asset.content))
  }

  function handler (pageClass) {
    return async (req, res, next) => {
      const page = pageClass.makeOne(req)
      if (page) {
        const response = await query(page.dataRequest.requestString, page.dataRequest.variableValues)
        // console.log('GraphQL error(s)', response.errors || response.error)
        if (page.exists(response.data)) {
          // console.log('Serving ' + page.path + ' as .html')
          res.type('.html')
          res.send(htmlMinifier.minify(container.make({page, scripts}).render(response.data), {collapseWhitespace: true}))
          return
        }
      }
      next('route')
    }
  }

  for (var pageClass of generatePageClasses()) {
    router.get(pageClass.path, handler(pageClass))
    console.log('Ready to serve', pageClass.path)
  }

  router.use('/graphql', expressGraphql({schema, rootValue, graphiql: true}))

  return router
}

async function generate ({dataDirectory, outputDirectory}) {
  const schema = graphqlApi.schema
  const rootValue = graphqlApi.makeRoot({load: () => data_.load(path.join(dataDirectory, 'data.json'))})
  function query (requestString, variableValues) {
    return graphql.graphql(schema, requestString, rootValue, undefined, variableValues)
  }

  await fs.emptyDir(outputDirectory)

  fs.copy(path.join(dataDirectory, 'images'), outputDirectory)

  for (var asset of generateAssets({indexJsFlavor: 'generate'})) {
    const fileName = path.join(outputDirectory, asset.path)
    console.log('Generating', fileName)
    fs.outputFile(fileName, await asset.content)
  }

  for (var pageClass of generatePageClasses({query, scripts: []})) {
    for (var page of await pageClass.makeAll(query)) {
      const fileName = path.join(outputDirectory, page.path, 'index.html')
      console.log('Generating', fileName)
      const response = await query(page.dataRequest.requestString, page.dataRequest.variableValues)
      assert(page.exists(response.data))
      fs.outputFile(fileName, htmlMinifier.minify(container.make({page, scripts: []}).render(response.data), {collapseWhitespace: true}))
    }
  }
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
  return {
    path: '/robots.txt',
    content: 'Sitemap: https://splight.fr/sitemap.xml\n\nUser-agent: *\nAllow: /\n'
  }
}

function makeModernizerJs ({modernizrFeatures}) {
  return {
    path: '/modernizr.js',
    content: new Promise((resolve, reject) =>
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
  }
}

function makeIndexJs ({indexJsFlavor}) {
  return {
    path: '/index.js',
    content: new Promise((resolve, reject) =>
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
  }
}

function makeIndexCss ({modernizrFeatures}) {
  return {
    path: '/index.css',
    content: new Promise((resolve, reject) =>
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
  }
}

function * generatePageClasses () {
  yield {
    path: '/',
    makeOne: req => pages.root(),
    makeAll: query => [pages.root()]
  }

  yield {
    path: '/:city/',
    makeOne: req => pages.city(req.params.city),
    makeAll: async query => (await query('query{cities{slug}}')).data.cities.map(({slug}) => pages.city(slug))
  }

  function * makeAllTimespans_ (data) {
    const dateAfter = durations.oneWeek.clip(moment()).add(5, 'weeks')
    for (var city of data.cities) {
      for (var duration of durations.all) {
        for (
          var startDate = durations.oneWeek.clip(moment(city.firstDate, moment.HTML5_FMT.DATE, true));
          duration.dateAfter(startDate).isSameOrBefore(dateAfter);
          startDate = duration.links.next.startDate(startDate)
        ) {
          yield pages.timespan(city.slug, startDate, duration)
        }
      }
    }
  }

  async function makeAllTimespans (query) {
    return Array.from(makeAllTimespans_((await query('query{cities{slug firstDate}}')).data))
  }

  yield {
    path: '/:city/:timespan/',
    makeOne: req => pages.timespan.ofSlugs(req.params.city, req.params.timespan),
    makeAll: makeAllTimespans
  }
}

Object.assign(exports, {makeRouter, generate})
