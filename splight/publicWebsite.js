'use strict'

const assert = require('assert').strict
const path = require('path')

const browserify = require('browserify')
const CleanCSS = require('clean-css')
const deepcopy = require('deepcopy')
const modernizr = require('modernizr')
const moment = require('moment')
const neatJSON = require('neatjson').neatJSON
const sass = require('node-sass')

function * generate ({data, now, scripts}) {
  // yield* generateSkeleton()

  yield * generateAssets()

  const preparedData = prepareData({data, now})

  yield * Object.entries(preparedData).map(
    ([name, content]) => [name + '.json', Promise.resolve(neatJSON(content, {sort: true, wrap: true, afterColon: 1}) + '\n')]
  )
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
          data: '$modernizr-features: "' + modernizrFeatures.map(([detect, feature]) => '.mdrn-' + (feature || detect.split('/').slice(-1)[0])).join('') + '";\n\n@import "splight/website/index.scss"'
        },
        function (error, result) {
          if (error) {
            reject(error)
          } else {
            resolve(new CleanCSS({}).minify(result.css).styles)
          }
        }
      )
    ),
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
  data.cities = data.cities || {}

  Object.entries(data.cities).forEach(([slug, city]) => {
    assert(city.name)

    city.slug = slug

    city.tags = city.tags || {}
    Object.entries(city.tags).forEach(([slug, tag]) => {
      tag.slug = slug
    })

    city.events = city.events || {}

    Object.entries(city.events).forEach(([mainTag, events]) => {
      events.forEach(event => {
        event.tags = [mainTag].concat(event.tags || [])

        event.occurences = event.occurences || [{start: event.start}]
        delete event.start
        event.occurences.forEach(occurence => {
          occurence.start = moment(occurence.start, 'YYYY/MM/DD HH:mm', true)
        })
      })
    })

    city.firstDate = Object.values(city.events).reduce(
      (acc, events) => events.reduce(
        (acc, event) => event.occurences.reduce(
          (acc, occurence) => moment.min(occurence.start, acc),
          acc
        ),
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
  for (var citySlug in data.cities) {
    const city = data.cities[citySlug]
    for (var week = city.firstDate.clone().startOf('isoWeek'); week.isBefore(dateAfter); week.add(7, 'days')) {
      yield [
        path.join(city.slug, week.format('GGGG-[W]WW')),
        {
          events:
            Object.values(city.events).map(events =>
              events.map(
                ({title, occurences, tags}) => occurences.filter(
                  ({start}) => start.isSame(week, 'isoWeek')
                ).map(
                  ({start}) => ({title, start: start.format('YYYY/MM/DD HH:mm'), tags})
                )
              ).reduce((a, b) => a.concat(b), [])
            ).reduce((a, b) => a.concat(b), [])
        }
      ]
    }
  }
}

exports.forTest = {
  prepareData
}

exports.generate = generate
