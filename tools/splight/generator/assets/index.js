'use strict'

const fs = require('fs-extra')
const path = require('path')

const browserify = require('browserify')
const CleanCSS = require('clean-css')
const modernizr = require('modernizr')
const sass = require('node-sass')

exports.generate = function (outputDirectory) {
  // Could we avoid having skeleton files?
  // @todo Produce CNAME and .nojekyll
  // @todo Produce external.svg with appropriate color
  fs.copySync(path.join(__dirname, 'skeleton'), outputDirectory)

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

  browserify('splight/website/index.js').transform('stringify', ['.html']).transform('uglifyify', {global: true}).bundle(function (error, result) {
    if (error) {
      throw error
    } else {
      fs.outputFileSync(path.join(outputDirectory, 'index.js'), result)
    }
  })

  sass.render(
    {
      data: '$modernizr-features: "' + modernizrFeatures.map(([detect, feature]) => '.mdrn-' + (feature || detect.split('/').slice(-1)[0])).join('') + '";\n\n@import "splight/website/index.scss"'
    },
    function (error, result) {
      if (error) {
        throw error
      } else {
        fs.outputFileSync(path.join(outputDirectory, 'index.css'), new CleanCSS({}).minify(result.css).styles)
      }
    }
  )
}
