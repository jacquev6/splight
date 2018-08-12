'use strict'

const fs = require('fs-extra')
const path = require('path')
const neatJSON = require('neatjson')

const datetime = require('./splight/datetime')

async function main (dataFile) {
  const data = await fs.readJSON(dataFile)

  Object.values(data.cities).forEach(city => {
    city.events.forEach(event => {
      event.occurrences.forEach(occurrence => {
        occurrence.start = datetime.datetime(occurrence.start).add(1, 'week').format(datetime.HTML5_FMT.DATETIME_LOCAL)
      })
    })
  })

  await fs.outputFile(dataFile, neatJSON.neatJSON(data, {sort: true, wrap: 120, afterColon: 1, afterComma: 1}) + '\n')
}

main(path.join(process.argv[2], 'data.json'))
