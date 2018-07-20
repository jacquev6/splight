'use strict'

const assert = require('assert').strict
const moment = require('moment')

function make ({fetcher, now}) {
  function getNow () {
    return now
  }

  const cities = (async () =>
    (await fetcher.cities).map(({slug, name}) => ({slug, name}))
  )()

  function getCities () {
    return cities
  }

  const citiesBySlug = (async () => {
    const citiesBySlug = {}
    ;(await fetcher.cities).forEach(({slug, name, tags}) => {
      citiesBySlug[slug] = {
        slug,
        name,
        tags: tags.map(({slug, title}) => ({slug, title}))
      }
    })
    return citiesBySlug
  })()

  async function getCity (citySlug) {
    return (await citiesBySlug)[citySlug]
  }

  const events = {}

  function fetchEvents (citySlug, week) {
    assert(week.isSame(week.clone().startOf('isoWeek')))
    const key = citySlug + '/' + week.format()
    if (!events[key]) {
      events[key] = (async () =>
        (await fetcher.getCityWeek(citySlug, week)).events.map(({start, title, tags}) => ({
          start: moment(start, moment.HTML5_FMT.DATETIME_LOCAL, true),
          title,
          tags
        }))
      )()
    }
    return events[key]
  }

  async function getEvents (citySlug, startDate, dateAfter) {
    const weeks = []
    for (var week = startDate.clone().startOf('isoWeek'); week.isBefore(dateAfter); week.add(7, 'days')) {
      weeks.push(fetchEvents(citySlug, week))
    }
    return (await Promise.all(weeks)).reduce(
      (a, b) => a.concat(b)
    ).filter(
      ({start}) => start.isBetween(startDate, dateAfter, null, '[)')
    )
  }

  return {getNow, getCities, getCity, getEvents}
}

exports.make = make
