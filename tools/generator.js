'use strict'
const fs = require('fs-extra')
const path = require('path')

const browserify = require('browserify')
const modernizr = require('modernizr')
const mustache = require('mustache')
const sass = require('node-sass')

const multiYaml = require('./multi-yaml')

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

function render (contentTemplate, contentData, destination) {
  const staticContent = mustache.render(fs.readFileSync(path.join('templates', 'static_content', contentTemplate), 'utf8'), contentData)
  fs.outputFileSync(
    path.join(outputDirectory, destination),
    mustache.render(
      fs.readFileSync('templates/container.html', 'utf8'),
      {static_content: staticContent}
    )
  )
}

render('index.html', {}, 'index.html')

for (const citySlug in data.cities) {
  const city = Object.assign({}, data.cities[citySlug], {slug: citySlug})

  const tags = (function () {
    var tags = []
    for (const tagSlug in city.tags) {
      const tag = Object.assign({}, city.tags[tagSlug], {slug: tagSlug})
      tags.push(tag)
    }
    return tags.sort((t1, t2) => t1.display_order - t2.display_order).map(({slug, title}) => ({slug: slug, title: title}))
  })()

  render(
    'city/index.html',
    {
      city: city,
      tags: tags,
      first_week: {slug: '2018-W21'} // @todo Compute instead of hard-coding
    },
    path.join(citySlug, 'index.html')
  )

  // fs.ensureDirSync(outputDirectory + "/" + citySlug);

  // const events = new Set();
  // for(const tagSlug in city.events) {
  //   const tagged_events = city.events[tagSlug];

  //   tagged_events.forEach(event => events.add(event));
  // }

  // console.log(citySlug, events.size);
}
