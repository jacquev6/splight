'use strict'

require('stringify').registerWithRequire(['.html'])

const fs = require('fs-extra')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line
const path = require('path')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const publicWebsite = require('./splight/publicWebsite')
const data_ = require('./splight/data')

async function main (inputDataFile, outputDirectory) {
  const data = await data_.load(inputDataFile)
  await data_.dump(data, inputDataFile)
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
