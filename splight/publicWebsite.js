'use strict'

const assert = require('assert').strict
const browserify = require('browserify')
const CleanCSS = require('clean-css')
const deepcopy = require('deepcopy')
const fs = require('fs-extra')
const modernizr = require('modernizr')
const moment = require('moment')
const mustache = require('mustache')
const neatJSON = require('neatjson').neatJSON
const path = require('path')
const sass = require('node-sass')

// @todo Remove when https://github.com/moment/moment/issues/4698 is fixed on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'
assert.equal(moment.HTML5_FMT.WEEK, 'GGGG-[W]WW')

function * generate ({data, now, scripts}) {
  // @todo favicon.ico
  // @todo robots.txt

  yield * generateSkeleton()

  yield * generateAssets()

  const preparedData = prepareData({data, now})

  yield * Object.entries(preparedData).map(
    ([name, content]) => [name + '.json', Promise.resolve(neatJSON(content, {sort: true, wrap: true, afterColon: 1}) + '\n')]
  )

  yield * generatePages({preparedData, now, scripts})
}

function * generateSkeleton () {
  const skeleton = path.join(__dirname, 'publicWebsite/skeleton')
  yield * fs.readdirSync(skeleton).map(fileName => [fileName, fs.readFile(path.join(skeleton, fileName))])
}

function * generateAssets () {
  const modernizrFeatures = [
    ['test/es6/arrow'],
    ['test/es6/collections', 'es6collections'],
    ['test/hashchange'],
    ['test/history'],
    ['test/canvas']
  ]

  yield [
    'modernizr.js',
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
          // @todo Minify/uglify result
          resolve(result)
        }
      )
    )
  ]

  yield [
    'index.js',
    new Promise((resolve, reject) =>
      // @todo Use watchify when serving site using nodemon
      browserify('splight/publicWebsite/assets/index.js')
        .transform('stringify', ['.html'])
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

  yield [
    'index.css',
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

function prepareData (config) {
  const ret = {}
  for (var [k, v] of _prepareData(config)) {
    ret[k] = v
  }
  return ret
}

function * _prepareData ({data, now}) {
  data = deepcopy(data)
  data.cities = data.cities || []

  data.cities.forEach(city => {
    assert(city.slug)
    assert(city.name)

    city.tags = city.tags || []
    city.tags.forEach(tag => {
      assert(tag.slug)
      assert(tag.title)
    })

    city.events = city.events || []
    city.events.forEach(event => {
      event.occurences = event.occurences || []
      event.occurences.forEach(occurence => {
        occurence.start = moment(occurence.start, moment.HTML5_FMT.DATETIME_LOCAL, true)
      })
    })

    city.firstDate = city.events.reduce(
      (acc, event) => event.occurences.reduce(
        (acc, occurence) => moment.min(occurence.start, acc),
        acc
      ),
      now
    )
  })

  yield [
    'cities',
    Object.values(data.cities).sort(
      (cityA, cityB) => cityA.displayOrder - cityB.displayOrder
    ).map(
      ({slug, name, firstDate, tags}) => ({
        slug,
        name,
        firstDate: firstDate.format(moment.HTML5_FMT.DATE),
        tags:
          Object.values(tags).sort(
            (tagA, tagB) => tagA.displayOrder - tagB.displayOrder
          ).map(
            ({slug, title, displayOrder}) => ({slug, title})
          )
      })
    )
  ]

  const dateAfter = now.clone().startOf('isoWeek').add(5, 'weeks')
  for (var city of data.cities) {
    for (var week = city.firstDate.clone().startOf('isoWeek'); week.isBefore(dateAfter); week.add(7, 'days')) {
      yield [
        path.join(city.slug, week.format(moment.HTML5_FMT.WEEK)),
        {
          events:
            city.events.map(
              ({title, occurences, tags}) => occurences.filter(
                ({start}) => start.isSame(week, 'isoWeek')
              ).map(
                ({start}) => ({title, start: start.format(moment.HTML5_FMT.DATETIME_LOCAL), tags})
              )
            ).reduce((a, b) => a.concat(b), [])
        }
      ]
    }
  }
}

function * generatePages ({preparedData, now, scripts}) {
  const fetcher = {
    getCities: async function () {
      return deepcopy(preparedData['cities'])
    },

    getCityWeek: async function (citySlug, week) {
      return preparedData[path.join(citySlug, week.format(moment.HTML5_FMT.WEEK))]
    }
  }

  const pages = require('./publicWebsite/pages')(fetcher)

  function renderContained ({title, jumbotron, content}) {
    return mustache.render(require('./publicWebsite/container.html'), {title, scripts, jumbotron, content})
  }

  yield [
    'index.html',
    pages.index.make().then(renderContained)
  ]

  // @todo Use keys in preparedData instead of recomputing them
  const dateAfter = now.clone().startOf('isoWeek').add(5, 'weeks')
  for (var city of preparedData['cities']) {
    yield [
      path.join(city.slug, 'index.html'),
      pages.cityIndex(city.slug).make().then(renderContained)
    ]

    for (var week = moment(city.firstDate, moment.HTML5_FMT.DATE, true).startOf('isoWeek'); week.isBefore(dateAfter); week.add(7, 'days')) {
      const weekSlug = week.format(moment.HTML5_FMT.WEEK)
      yield [
        path.join(city.slug, weekSlug, 'index.html'),
        pages.cityTimespan(city.slug, weekSlug).make().then(renderContained)
      ]
    }
  }
}

exports.forTest = {
  prepareData
}

exports.generate = generate
