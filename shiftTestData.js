'use strict'

const fs = require('fs-extra')
const moment = require('moment')
const path = require('path')
const neatJSON = require('neatjson')

async function main (dataFile) {
  const data = await fs.readJSON(dataFile)

  Object.values(data.cities).forEach(city => {
    city.events.forEach(event => {
      event.occurrences.forEach(occurrence => {
        occurrence.start = moment(occurrence.start, moment.HTML5_FMT.DATETIME_LOCAL, true).add(1, 'week').format(moment.HTML5_FMT.DATETIME_LOCAL)
      })
    })
  })

  await fs.outputFile(dataFile, neatJSON.neatJSON(data, {sort: true, wrap: 120, afterColon: 1, afterComma: 1}) + '\n')
}

main(path.join(process.argv[2], 'data.json'))
