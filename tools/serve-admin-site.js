'use strict'
const path = require('path')

const express = require('express')

require('stringify').registerWithRequire(['.html'])

const multiYaml = require('./multi-yaml')
const generator = require('./splight/generator')

function serve () {
  generator.assets.generate('.serve-admin-site/assets')

  const htmlGenerator = generator.html.generator(multiYaml.load(process.argv[2]), true)

  const app = express()

  require('reload')(app)

  app.use(express.static(path.join(__dirname, '.serve-admin-site/assets')))

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
