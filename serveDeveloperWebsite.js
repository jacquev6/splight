'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const express = require('express')
const reload = require('reload')

const adminWebsite = require('./splight/adminWebsite')
const datetime = require('./splight/datetime')

async function main (dataDirectory) {
  console.log('Starting developer website...')

  const app = express()

  app.use(await adminWebsite.makeRouter({
    dataDirectory,
    scripts: [
      '/reload/reload.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
    ],
    generationDate: datetime.now().subtract(1, 'week')
  }))

  reload(app)

  app.listen(8000, () => console.log('Developer website live at http://localhost:8000/admin/'))
}

main(process.argv[2])
