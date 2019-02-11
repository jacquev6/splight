'use strict'

const assert = require('assert').strict
const moment = require('moment')

const cityContent = require('./widgets/cityContent')
const cityTitle = require('./widgets/cityTitle')
const datetime = require('../datetime')
const durations = require('./durations')
const paths = require('./paths')
const rootContent = require('./widgets/rootContent')
const rootTitle = require('./widgets/rootTitle')
const timespanContent = require('./widgets/timespanContent')

function root () {
  const title = rootTitle.make()
  const content = rootContent.make()

  return {
    path: paths.root(),
    dataRequest: {
      requestString: '{cities{slug name image}}',
      variableValues: undefined
    },
    exists: data => true,
    title,
    content
  }
}

function city (citySlug) {
  const title = cityTitle.make({citySlug})
  const content = cityContent.make({citySlug})

  return {
    path: paths.city(citySlug),
    dataRequest: {
      requestString: 'query($citySlug:ID!){generation{date} city(slug:$citySlug){slug name tags{slug title image} allTagsImage}}',
      variableValues: {citySlug}
    },
    exists: data => data && data.city,
    title,
    content
  }
}

function timespan (citySlug, startDate, duration) {
  startDate = duration.clip(startDate)
  const dateAfter = duration.dateAfter(startDate)

  const title = cityTitle.make({citySlug})
  const content = timespanContent.make({citySlug, startDate, dateAfter, duration})

  return {
    path: paths.timespan(citySlug, startDate, duration),
    dataRequest: {
      requestString: 'query($citySlug:ID!,$first:Date!,$after:Date!){generation{date dateAfter} city(slug:$citySlug){slug name tags{slug title} firstDate events(dates:{start:$first, after:$after}){id title tags{slug title} artist{name description website image} location{name description website image phone address} occurrences{start} reservationPage}}}',
      variableValues: {
        citySlug,
        first: startDate.format(datetime.HTML5_FMT.DATE),
        after: dateAfter.format(datetime.HTML5_FMT.DATE)
      }
    },
    exists: data => {
      if (!data || !data.city) {
        return false
      }

      const maxDateAfter = datetime.date(data.generation.dateAfter)
      var minStartDate = durations.oneWeek.clip(datetime.date(data.generation.date))

      if (data.city.firstDate) {
        minStartDate = moment.min(
          minStartDate,
          durations.oneWeek.clip(datetime.date(data.city.firstDate))
        )
      }

      return startDate.isSameOrAfter(minStartDate) && dateAfter.isSameOrBefore(maxDateAfter)
    },
    title,
    content
  }
}

timespan.ofSlugs = function (citySlug, timespanSlug) {
  for (var duration of durations.all) {
    const startDate = moment(timespanSlug, duration.slugFormat, true)
    if (startDate.isValid()) {
      return timespan(citySlug, startDate, duration)
    }
  }
}

function fromPath (path) {
  const parts = path.split('/')
  assert(parts[0] === '', 'Unexpected path: ' + path)
  assert(parts.slice(-1)[0] === '', 'Unexpected path: ' + path)
  switch (parts.length) {
    case 2:
      return root()
    case 3:
      return city(parts[1])
    case 4:
      return timespan.ofSlugs(parts[1], parts[2])
    default:
      assert.fail('Unexpected path: ' + path)
  }
}

Object.assign(exports, {root, city, timespan, fromPath})
