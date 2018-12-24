'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const express = require('express')
const reload = require('reload')

const adminWebsite = require('./adminWebsite')

async function main () {
  console.log('Starting developer website...')

  const app = express()

  app.use(await adminWebsite.makeRouter({
    scripts: [
      '/reload/reload.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js'
    ]
  }))

  reload(app)

  app.listen(80, () => console.log('Website live!'))
}

main()
