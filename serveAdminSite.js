'use strict'
const path = require('path')

const express = require('express')
const fs = require('fs-extra')
const opn = require('opn')

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

  // @todo Add a favicon in skeleton
  app.get(
    '/favicon.ico',
    (req, res) => res.status(404)
  )

  app.get(
    '/cities.json',
    async (req, res) => res.send(await htmlGenerator.citiesData())
  )

  app.get(
    '/',
    async (req, res) => res.send(await htmlGenerator.indexPage())
  )

  app.get(
    '/:city/',
    async (req, res) => res.send(await htmlGenerator.cityPage(req.params.city))
  )

  app.get(
    '/:city/:timespan.json',
    async (req, res) => res.send(await htmlGenerator.timespanData(req.params.city, req.params.timespan))
  )

  app.get(
    '/:city/:timespan/',
    async (req, res) => res.send(await htmlGenerator.timespanPage(req.params.city, req.params.timespan))
  )

  app.listen(8000, () => {
    const address = 'http://localhost:8000/'
    console.log('Admin site live at', address)
    opn(address)
  })
}

serve()
