'use strict'

const bodyParser = require('body-parser')
const express = require('express')
const moment = require('moment')

const durations = require('../publicWebsite/durations')
const paths = require('../publicWebsite/paths')

function populateApp ({app, handleDataChange, data}) {
  const router = express.Router()
  app.use(router)

  router.use(bodyParser.json())

  router.get('/admin/api/artists/', function (req, res) {
    res.send(Object.entries(data.artists).map(([slug, {name}]) => ({slug, name})))
  })

  router.get('/admin/api/cities/', function (req, res) {
    res.send(data.cities.map(({slug, name}) => ({slug, name})))
  })

  function cityBySlug (citySlug) {
    for (var city of data.cities) {
      if (city.slug === citySlug) {
        return city
      }
    }
  }

  router.get('/admin/api/cities/:citySlug/tags/', function (req, res) {
    const citySlug = req.params.citySlug

    res.send(cityBySlug(citySlug).tags.map(({slug, title}) => ({slug, title})))
  })

  router.get('/admin/api/cities/:citySlug/locations/', function (req, res) {
    const citySlug = req.params.citySlug

    res.send(Object.entries(cityBySlug(citySlug).locations).map(([slug, {name}]) => ({slug, name})))
  })

  router.post('/admin/api/cities/:citySlug/events/', async function (req, res) {
    const citySlug = req.params.citySlug
    const event = req.body

    if (typeof event.artist === 'object') {
      const artist = event.artist
      const artistSlug = artist.slug
      delete artist.slug
      event.artist = artistSlug
      data.artists[artistSlug] = artist
    }

    const city = cityBySlug(citySlug)

    if (typeof event.location === 'object') {
      const location = event.location
      const locationSlug = location.slug
      delete location.slug
      event.location = locationSlug
      city.locations[locationSlug] = location
    }

    city.events.push(event)

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
