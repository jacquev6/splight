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

const pages_ = require('./publicWebsite/pages')

// @todo Remove when https://github.com/moment/moment/issues/4698 is fixed on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'
assert.equal(moment.HTML5_FMT.WEEK, 'GGGG-[W]WW')

function * generate ({data, now, scripts}) {
  const dateAfter = now.clone().startOf('isoWeek').add(5, 'weeks')

  // @todo favicon.ico
  // @todo robots.txt

  yield * generateSkeleton()

  yield * generateAssets()

  const preparedData = prepareData({data, now, dateAfter})

  yield * Object.entries(preparedData).map(
    ([name, content]) => ['/' + name + '.json', Promise.resolve(neatJSON(content, {sort: true, wrap: true, afterColon: 1}) + '\n')]
  )

  yield * generatePages({preparedData, now, dateAfter, scripts})
}

function * generateSkeleton () {
  const skeleton = path.join(__dirname, 'publicWebsite/skeleton')
  yield * fs.readdirSync(skeleton).map(fileName => ['/' + fileName, fs.readFile(path.join(skeleton, fileName))])
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
          // @todo Minify/uglify result
          resolve(result)
        }
      )
    )
  ]

  yield [
    '/index.js',
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

function prepareData (config) {
  const ret = {}
  for (var [k, v] of _prepareData(config)) {
    ret[k] = v
  }
  return ret
}

function * _prepareData ({data, now, dateAfter}) {
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
  })

  yield [
    'cities',
    Object.values(data.cities).sort(
      (cityA, cityB) => cityA.displayOrder - cityB.displayOrder
    ).map(
      ({slug, name, firstDate, tags}) => ({
        slug,
        name,
        tags:
          Object.values(tags).sort(
            (tagA, tagB) => tagA.displayOrder - tagB.displayOrder
          ).map(
            ({slug, title, displayOrder}) => ({slug, title})
          )
      })
    )
  ]

  const oneWeek = pages_.durations.oneWeek
  for (var city of data.cities) {
    const eventsByWeek = {}
    city.events.forEach(({title, occurences, tags}) => {
      occurences.forEach(({start}) => {
        const week = start.format(oneWeek.slugFormat)
        if (!eventsByWeek[week]) {
          eventsByWeek[week] = []
        }
        eventsByWeek[week].push({title, start: start.format(moment.HTML5_FMT.DATETIME_LOCAL), tags})
      })
    })
    const firstDate = Object.keys(eventsByWeek).map(weekSlug => moment(weekSlug, oneWeek.slugFormat, true)).reduce((a, b) => moment.min(a, b), now)
    for (var startDate = firstDate.clone(); oneWeek.dateAfter(startDate).isSameOrBefore(dateAfter); startDate = oneWeek.links.next.startDate(startDate)) {
      const weekSlug = startDate.format(oneWeek.slugFormat)
      const events = eventsByWeek[weekSlug] || []
      yield [
        path.join(city.slug, weekSlug),
        {events}
      ]
    }
  }
}

function * generatePages ({preparedData, now, dateAfter, scripts}) {
  function renderContained ({title, jumbotron, content}) {
    return mustache.render(require('./publicWebsite/container.html'), {title, scripts, jumbotron, content})
  }

  for (var page of _generatePages({preparedData, now, dateAfter})) {
    yield [
      page.path,
      page.make().then(renderContained)
    ]
  }
}

function * _generatePages ({preparedData, now, dateAfter}) {
  const fetcher = {
    getCities: async function () {
      return deepcopy(preparedData['cities'])
    },

    getCityWeek: async function (citySlug, week) {
      return preparedData[path.join(citySlug, week.format(moment.HTML5_FMT.WEEK))]
    }
  }

  const pages = pages_.make(now, fetcher)

  yield pages.index

  for (var city of preparedData['cities']) {
    yield pages.cityIndex(city.slug)
  }

  for (var key in preparedData) {
    const parts = key.split('/')
    if (parts.length === 2) {
      const [citySlug, weekSlug] = parts
      const weekStartDate = moment(weekSlug, pages_.durations.oneWeek.slugFormat, true)
      const weekDateAfter = pages_.durations.oneWeek.dateAfter(weekStartDate)
      const isLastWeek = weekDateAfter.isSameOrAfter(dateAfter)
      for (var duration of Object.values(pages_.durations)) {
        for (
          var startDate = weekStartDate.clone();
          (isLastWeek ? duration.dateAfter(startDate).isSameOrBefore(dateAfter) : startDate.isBefore(weekDateAfter));
          startDate = duration.links.next.startDate(startDate)
        ) {
          yield pages.cityTimespan(citySlug, startDate, duration)
        }
      }
    }
  }
}

exports.forTest = {
  prepareData
}

exports.generate = generate
