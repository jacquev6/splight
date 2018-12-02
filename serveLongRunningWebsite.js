'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const express = require('express')

const adminWebsite = require('./splight/adminWebsite')
const datetime = require('./splight/datetime')

async function main (dataDirectory) {
  console.log('Starting developer website...')

  const app = express()

  app.use(await adminWebsite.makeRouter({
    dataDirectory,
    scripts: [
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
    ],
    generationDate: datetime.now().subtract(1, 'week')
  }))

  app.listen(80, () => console.log('Listening at http://localhost:80/'))
}

main(process.argv[2])
