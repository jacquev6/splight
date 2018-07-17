'use strict'

require('stringify').registerWithRequire(['.html'])

const fs = require('fs-extra')
const moment = require('moment')
const path = require('path')
const publicWebsite = require('./splight/publicWebsite')
const splightData = require('./splight/data')

async function main (inputDataFile, outputDirectory) {
  const data = await splightData.load(inputDataFile)
  await splightData.dump(data, inputDataFile)
  await fs.emptyDir(outputDirectory)

  for (var [name, content] of publicWebsite.generate({
    data,
    now: moment(),
    scripts: []
  })) {
    if (name.endsWith('/')) {
      name += 'index.html'
    }
    console.log('Generating', name)
    fs.outputFile(path.join(outputDirectory, name), await content)
  }
}

main(process.argv[2], process.argv[3])
