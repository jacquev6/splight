'use strict'

require('stringify').registerWithRequire(['.html', '.gqls'])

const publicWebsite = require('./splight/publicWebsite')

publicWebsite.generate({
  dataGitRemote: process.argv[2],
  outputDirectory: process.argv[3]
})
