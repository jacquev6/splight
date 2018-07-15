'use strict'

const assert = require('assert').strict
const path = require('path')

const deepcopy = require('deepcopy')
const moment = require('moment')
const neatJSON = require('neatjson').neatJSON

function * generate ({data, now, scripts}) {
  // yield* generateSkeleton()

  // yield* generateAssets()

  const preparedData = prepareData({data, now})

  yield * Object.entries(preparedData).map(
    ([name, content]) => [name + '.json', neatJSON(content, {sort: true, wrap: true, afterColon: 1}) + '\n']
  )
}

function prepareData (config) {
  const ret = {}
  for (var [k, v] of _prepareData(config)) {
    ret[k] = v
  }
  return ret
}

function * _prepareData ({data, now}) {
  data = deepcopy(data)
  data.cities = data.cities || {}

  Object.entries(data.cities).forEach(([slug, city]) => {
    assert(city.name)

    city.slug = slug

    city.tags = city.tags || {}
    Object.entries(city.tags).forEach(([slug, tag]) => {
      tag.slug = slug
    })

    city.events = city.events || {}

    Object.entries(city.events).forEach(([mainTag, events]) => {
      events.forEach(event => {
        event.tags = [mainTag].concat(event.tags || [])

        event.occurences = event.occurences || [{start: event.start}]
        delete event.start
        event.occurences.forEach(occurence => {
          occurence.start = moment(occurence.start, 'YYYY/MM/DD HH:mm', true)
        })
      })
    })

    city.firstDate = Object.values(city.events).reduce(
      (acc, events) => events.reduce(
        (acc, event) => event.occurences.reduce(
          (acc, occurence) => moment.min(occurence.start, acc),
          acc
        ),
        acc
      ),
      now
    )
  })

  yield [
    'cities',
    Object.values(data.cities).sort(
      (cityA, cityB) => cityA.displayOrder - cityB.displayOrder
    ).map(
      ({slug, name, firstDate, tags}) => ({
        slug,
        name,
        firstDate: firstDate.format(moment.HTML5_FMT.DATE),
        tags:
          Object.values(tags).sort(
            (tagA, tagB) => tagA.displayOrder - tagB.displayOrder
          ).map(
            ({slug, title, displayOrder}) => ({slug, title})
          )
      })
    )
  ]

  const dateAfter = now.clone().startOf('isoWeek').add(5, 'weeks')
  for (var citySlug in data.cities) {
    const city = data.cities[citySlug]
    for (var week = city.firstDate.clone().startOf('isoWeek'); week.isBefore(dateAfter); week.add(7, 'days')) {
      yield [
        path.join(city.slug, week.format('GGGG-[W]WW')),
        {
          events:
            Object.values(city.events).map(events => 
              events.map(
                ({title, occurences, tags}) => occurences.filter(
                  ({start}) => start.isSame(week, 'isoWeek')
                ).map(
                  ({start}) => ({title, start: start.format('YYYY/MM/DD HH:mm'), tags})
                )
              ).reduce((a, b) => a.concat(b), [])
            ).reduce((a, b) => a.concat(b), [])
        }
      ]
    }
  }
}

exports.forTest = {
  prepareData
}

exports.generate = generate
