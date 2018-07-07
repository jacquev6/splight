'use strict'
const fs = require('fs-extra')
const path = require('path')

const browserify = require('browserify')
const modernizr = require('modernizr')
const moment = require('moment')
const mustache = require('mustache')
const sass = require('node-sass')

const multiYaml = require('./multi-yaml')
const splightUrls = require('./splight-urls')

const dataDirectory = process.argv[2]
const outputDirectory = process.argv[3]

console.log('generator', dataDirectory, outputDirectory)

const data = multiYaml.load(dataDirectory)

fs.emptydirSync(outputDirectory)

fs.copySync('skeleton', outputDirectory)

const modernizrFeatures = [
  ['test/es6/arrow'],
  ['test/es6/collections', 'es6collections'],
  ['test/hashchange'],
  ['test/history'],
  ['test/canvas']
]

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
    fs.outputFileSync(path.join(outputDirectory, 'modernizr.js'), result)
  }
)

browserify('index.js').bundle(function (error, result) {
  if (error) {
    throw error
  } else {
    fs.outputFileSync(path.join(outputDirectory, 'index.js'), result)
  }
})

sass.render(
  {
    data: '$modernizr-features: "' + modernizrFeatures.map(([detect, feature]) => '.mdrn-' + (feature || detect.split('/').slice(-1)[0])).join('') + '";\n\n@import "index.scss"'
  },
  function (error, result) {
    if (error) {
      throw error
    } else {
      fs.outputFileSync(path.join(outputDirectory, 'index.css'), result.css)
    }
  }
)

function renderHtml (contentTemplate, contentData, subtitle, lead, destination) {
  const staticContent = mustache.render(fs.readFileSync(path.join('templates', 'static_content', contentTemplate), 'utf8'), contentData)
  fs.outputFileSync(
    path.join(outputDirectory, destination, 'index.html'),
    mustache.render(
      fs.readFileSync('templates/container.html', 'utf8'),
      {static_content: staticContent, subtitle: subtitle, lead: lead}
    )
  )
}

(function () {
  const cities = []
  for (const citySlug in data.cities) {
    const city = Object.assign({}, data.cities[citySlug], {slug: citySlug, url: splightUrls.makeCity({city: citySlug})})
    cities.push(city)
  }
  renderHtml('index.html', {cities: cities}, null, 'Votre agenda culturel régional', '')
})()

for (const citySlug in data.cities) {
  const city = Object.assign({}, data.cities[citySlug], {slug: citySlug})

  const tags = (function () {
    var tags = []
    for (const tagSlug in city.tags) {
      const tag = Object.assign({}, city.tags[tagSlug], {slug: tagSlug})
      tags.push(tag)
    }
    return tags.sort(
      (tag1, tag2) => tag1.display_order - tag2.display_order
    ).map(
      ({slug, title}) => ({slug: slug, title: title})
    )
  })()

  const events = (function () {
    const events = []
    for (const mainTag in city.events) {
      city.events[mainTag].forEach(function (event) {
        events.push({
          start: moment(event.datetime, 'YYYY/MM/DD HH:mm', true)
        })
      })
    }
    return events.sort(
      (e1, e2) => e1.start.diff(e2.start)
    )
  })()

  renderHtml(
    'city_index.html',
    {
      city: city,
      tags: tags,
      first_week_url: splightUrls.makeWeek({city: city.slug, week: events[0].start})
    },
    {
      href: splightUrls.makeCity({city: city.slug}),
      text: city.name
    },
    'Votre agenda culturel à ' + city.name + ' et dans sa région',
    citySlug
  )
}
