'use strict'

const fs = require('fs-extra')

const assets = require('./assets')
const html = require('./html')

exports.generate = function (data, outputDirectory) {
  fs.emptydirSync(outputDirectory)

  assets.generate(outputDirectory)

  html.generate(data, outputDirectory)
}

exports.assets = assets
exports.html = html
