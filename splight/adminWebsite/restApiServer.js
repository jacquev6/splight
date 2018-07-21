'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const moment = require('moment')

const durations = require('../publicWebsite/durations')
const paths = require('../publicWebsite/paths')

function populateApp ({app, prefix, handleDataChange, data}) {
  const router = express.Router()
  app.use(router)

  router.use(bodyParser.json())

  router.post('/admin/api/cities/:citySlug/events/', async function (req, res) {
    const citySlug = req.params.citySlug
    const event = req.body

    for (var city of data.cities) {
      if (city.slug === citySlug) {
        city.events.push(event)
        break
      }
    }

    handleDataChange()

    res.send({
      visible_at: event.occurences.map(({start}) =>
        paths.timespan(
          citySlug,
          moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true),
          durations.oneWeek
        )
      )
    })
  })
}

exports.populateApp = populateApp
