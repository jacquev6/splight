'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const express = require('express')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line
const reload = require('reload')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const adminWebsite = require('./splight/adminWebsite')

async function main (dataDirectory) {
  console.log('Starting developer website...')

  const app = express()

  app.use(await adminWebsite.makeRouter({
    dataDirectory,
    scripts: [
      '/reload/reload.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
    ]
  }))

  reload(app)

  app.listen(8000, () => console.log('Developer website live at http://localhost:8000/admin/'))
}

main(process.argv[2])
