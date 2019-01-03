'use strict'

const bodyParser = require('body-parser')
const browserify = require('browserify')
const CleanCSS = require('clean-css')
const express = require('express')
const expressGraphql = require('express-graphql')
const htmlMinifier = require('html-minifier')
const modernizr = require('modernizr')
const path = require('path')
const sass = require('node-sass')
const terser = require('terser')

const container = require('./publicWebsite/widgets/container')
const datetime = require('./datetime')
const durations = require('./publicWebsite/durations')
const pages = require('./publicWebsite/pages')
const tagColoring = require('./tagColoring')

async function makeRouter ({api, scripts, generationDate}) {
  const router = express.Router()

  router.use('/images', express.static('splight/images'))

  router.use(bodyParser.json({limit: '50mb'})) // https://stackoverflow.com/a/19965089/905845
  router.use('/graphql', expressGraphql(Object.assign({graphiql: true}, api)))

  for (var asset of generateAssets({api})) {
    const type = path.extname(asset.path)
    console.log('Preparing to serve', asset.path, 'as', type)
    router.get(asset.path, (content => async (req, res) => res.type(type).send(content))(await asset.content))
  }

  function htmlHandler (pageClass) {
    return async (req, res, next) => {
      const page = pageClass.makeOne(req)
      if (page) {
        const {data} = await api.request(page.dataRequest)
        if (page.exists(data)) {
          res.type('.html')
          res.send(htmlMinifier.minify(container.make({page, scripts}).render(data), {collapseWhitespace: true}))
          return
        }
      }
      next('route')
    }
  }

  function jsonHandler (pageClass) {
    return async (req, res, next) => {
      const page = pageClass.makeOne(req)
      if (page) {
        const {data} = await api.request(page.dataRequest)
        if (page.exists(data)) {
          res.type('.json')
          res.send(data)
          return
        }
      }
      next('route')
    }
  }

  for (var pageClass of generatePageClasses()) {
    router.get(pageClass.path, htmlHandler(pageClass))
    router.get(pageClass.path + 'data.json', jsonHandler(pageClass))
    console.log('Ready to serve', pageClass.path)
  }

  return router
}

function * generateAssets ({api}) {
  const modernizrFeatures = [
    // ['test/iframe/seamless'], // Not supported by Firefox 61. Uncomment to test hasModernJavascript in index-generate.js
    ['test/es6/arrow'],
    ['test/es6/collections', 'es6collections'],
    ['test/hashchange'],
    ['test/history'],
    ['test/canvas']
  ]

  yield makeRobotsTxt()
  yield makeModernizerJs({modernizrFeatures})
  yield makeIndexJs()
  yield makeIndexCss({modernizrFeatures, api})
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

function makeIndexJs () {
  return {
    path: '/index.js',
    content: new Promise((resolve, reject) =>
      browserify('splight/publicWebsite/assets/index.js')
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

function makeIndexCss (config) {
  return {
    path: '/index.css',
    content: makeIndexCss_(config)
  }
}

async function makeIndexCss_ ({modernizrFeatures, api}) {
  const sassData = []

  sassData.push('$modernizr-features: "' + modernizrFeatures.map(([detect, feature]) => '.mdrn-' + (feature || detect.split('/').slice(-1)[0])).join('') + '";')

  for (var line of tagColoring.makeSassPreamble({cities: (await api.request({requestString: 'query{cities{slug tags{slug}}}'})).data.cities})) {
    sassData.push(line)
  }

  sassData.push('@import "splight/publicWebsite/assets/index.scss";')

  return new Promise((resolve, reject) =>
    sass.render(
      {data: sassData.join('\n')},
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

function * generatePageClasses () {
  yield {
    path: '/',
    makeOne: req => pages.root(),
    dataRequest: null,
    makeAll: data => [pages.root()]
  }

  yield {
    path: '/:city/',
    makeOne: req => pages.city(req.params.city),
    dataRequest: {
      requestString: 'query{cities{slug}}'
    },
    makeAll: ({cities}) => cities.map(({slug}) => pages.city(slug))
  }

  yield {
    path: '/:city/:timespan/',
    makeOne: req => pages.timespan.ofSlugs(req.params.city, req.params.timespan),
    dataRequest: {
      requestString: 'query{generation{date, dateAfter} cities{slug firstDate}}'
    },
    makeAll: function * ({generation, cities}) {
      const globalDateAfter = datetime.date(generation.dateAfter)
      for (var {slug, firstDate} of cities) {
        var cityStartDate = durations.oneWeek.clip(datetime.date(generation.date))
        if (firstDate) {
          cityStartDate = durations.oneWeek.clip(datetime.date(firstDate))
        }
        for (var duration of durations.all) {
          for (
            var startDate = cityStartDate.clone();
            duration.dateAfter(startDate).isSameOrBefore(globalDateAfter);
            startDate = duration.links.next.startDate(startDate)
          ) {
            yield pages.timespan(slug, startDate, duration)
          }
        }
      }
    }
  }
}

Object.assign(exports, {makeRouter})
