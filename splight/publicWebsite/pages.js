'use strict'

const assert = require('assert').strict
const moment = require('moment')
const URI = require('urijs')

const cityContent = require('./widgets/cityContent')
const cityTitle = require('./widgets/cityTitle')
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
      requestString: '{cities{slug name}}',
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
      requestString: 'query($citySlug:ID!){city(slug:$citySlug){slug name tags{slug title}}}',
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
      requestString: 'query($citySlug:ID!,$first:Date!,$after:Date!){city(slug:$citySlug){slug name tags{slug title} firstDate events(dates:{start:$first, after:$after}){id title tags{slug title} artist{name} location{name} occurrences{start}}}}',
      variableValues: {
        citySlug,
        first: startDate.format(moment.HTML5_FMT.DATE),
        after: dateAfter.format(moment.HTML5_FMT.DATE)
      }
    },
    exists: data => {
      if (!data || !data.city) {
        return false
      }

      const now = moment()
      const maxDateAfter = durations.oneWeek.clip(now).add(5, 'weeks')
      var minStartDate = durations.oneWeek.clip(now)

      if (data.city.firstDate) {
        minStartDate = moment.min(
          minStartDate,
          durations.oneWeek.clip(moment(data.city.firstDate, moment.HTML5_FMT.DATE, true))
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

function fromPath (url) {
  const parts = URI.parse(url).path.split('/')
  assert(parts[0] === '', 'Unexpected path: ' + url)
  assert(parts.slice(-1)[0] === '', 'Unexpected path: ' + url)
  switch (parts.length) {
    case 2:
      return root()
    case 3:
      return city(parts[1])
    case 4:
      return timespan.ofSlugs(parts[1], parts[2])
    default:
      assert.fail('Unexpected path: ' + url)
  }
}

Object.assign(exports, {root, city, timespan, fromPath})
