'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const express = require('express')

const adminWebsite = require('./adminWebsite')

async function main () {
  console.log('Starting website...')

  const app = express()

  app.use(await adminWebsite.makeRouter({}))

  app.listen(80, () => console.log('Website live!'))
}
// @todo Ensure we handle SIGTERM in a timely manner
main()
