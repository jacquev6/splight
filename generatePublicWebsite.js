'use strict'

const path = require('path')

const fs = require('fs-extra')
const moment = require('moment')
require('stringify').registerWithRequire(['.html'])

const multiYaml = require('./multiYaml')
const publicWebsite = require('./splight/publicWebsite')

const data = multiYaml.load(process.argv[2])
const outputDirectory = process.argv[3]

fs.emptyDirSync(outputDirectory)

for (var [name, content] of publicWebsite.generate({
  data,
  now: moment(),
  scripts: []
})) {
  fs.outputFile(path.join(outputDirectory, name), content)
}
