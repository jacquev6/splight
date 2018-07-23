'use strict'

const moment = require('moment')

const data_ = require('./splight/data')

async function main (dataFile) {
  const data = await data_.load(dataFile)

  data.cities.forEach(city => {
    city.events.forEach(event => {
      event.occurences.forEach(occurence => {
        occurence.start = moment(occurence.start, moment.HTML5_FMT.DATETIME_LOCAL, true).add(1, 'week').format(moment.HTML5_FMT.DATETIME_LOCAL)
      })
    })
  })

  await data_.dump(data, dataFile)
}

main(process.argv[2])
