'use strict'
const path = require('path')

const express = require('express')
const fs = require('fs-extra')

require('stringify').registerWithRequire(['.html'])

const multiYaml = require('./multiYaml')
const generator = require('./splight/generator')

async function serve () {
  const assets = '.assets'

  await fs.emptyDir(assets)
  await generator.assets.generate(assets)

  const htmlGenerator = generator.html.generator(multiYaml.load(process.argv[2]), true)

  const app = express()

  require('reload')(app)

  app.use(express.static(path.join(__dirname, assets)))

  app.get(
    '/',
    (req, res) => res.send(htmlGenerator.indexPage())
  )

  app.get(
    '/:city/',
    (req, res) => res.send(htmlGenerator.cityPage(req.params.city))
  )

  app.get(
    '/:city/:timespan/',
    (req, res) => res.send(htmlGenerator.timespanPage(req.params.city, req.params.timespan))
  )

  app.listen(8000, () => console.log('Admin site listening on port 8000'))
}

serve()