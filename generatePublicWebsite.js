'use strict'

require('stringify').registerWithRequire(['.html'])

const fs = require('fs-extra')
const moment = require('moment')
const multiYaml = require('./multiYaml')
const path = require('path')
const publicWebsite = require('./splight/publicWebsite')

async function main (inputDirectory, outputDirectory) {
  const data = multiYaml.load(inputDirectory)
  await fs.emptyDir(outputDirectory)

  for (var [name, content] of publicWebsite.generate({
    data,
    now: moment(),
    scripts: []
  })) {
    console.log('Generating', name)
    fs.outputFile(path.join(outputDirectory, name), await content)
  }
}

main(process.argv[2], process.argv[3])
