'use strict'

const assert = require('assert').strict
const moment = require('moment')

function make ({fetcher, now}) {
  function getNow () {
    return now
  }

  const cities = fetcher.getCities()

  function getCities () {
    return cities
  }

  const citiesBySlug = cities.then(cities => {
    const citiesBySlug = {}
    cities.forEach(city => {
      citiesBySlug[city.slug] = city
    })
    return citiesBySlug
  })

  async function getCity (citySlug) {
    return (await citiesBySlug)[citySlug]
  }

  const cityWeeks = {}

  function getCityWeek (citySlug, week) {
    assert(week.isSame(week.clone().startOf('isoWeek')))
    const key = citySlug + '/' + week.format()
    if (!cityWeeks[key]) {
      cityWeeks[key] = fetcher.getCityWeek(citySlug, week).then(cityWeek => {
        cityWeek.events.forEach(event => {
          event.start = moment(event.start, moment.HTML5_FMT.DATETIME_LOCAL, true)
        })
        return cityWeek
      })
    }
    return cityWeeks[key]
  }

  async function getEvents (citySlug, startDate, dateAfter) {
    const weeksToFetch = []
    for (var week = startDate.clone().startOf('isoWeek'); week.isBefore(dateAfter); week.add(7, 'days')) {
      weeksToFetch.push(getCityWeek(citySlug, week).then(({events}) => events))
    }
    const weeks = await Promise.all(weeksToFetch)
    return weeks.reduce(
      (a, b) => a.concat(b)
    ).filter(
      ({start}) => start.isBetween(startDate, dateAfter, null, '[)')
    )
  }

  return {getNow, getCities, getCity, getEvents}
}

exports.make = make
