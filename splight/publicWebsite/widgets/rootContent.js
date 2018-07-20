'use strict'

const mustache = require('mustache')

const paths = require('../paths')
const template = require('./rootContent.html')

function make ({source}) {
  const cities = source.getCities()

  return {
    html: (async () =>
      mustache.render(
        template,
        {
          cities: (await cities).map(
            ({slug, name}) => ({slug, name, path: paths.city(slug)})
          )
        }
      )
    )(),
    initialize: () => undefined
  }
}

exports.make = make
