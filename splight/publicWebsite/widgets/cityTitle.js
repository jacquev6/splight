'use strict'

const mustache = require('mustache')

const paths = require('../paths')
const title = require('./title')

const headerTemplate = '<a href="/">Splight</a> - <a href="{{{path}}}">{{name}}</a>'
const leadTemplate = 'Votre agenda culturel à {{name}} et dans sa région'

function make ({source, citySlug}) {
  const city = source.getCity(citySlug)
  const path = paths.city(citySlug)

  return title.make({
    text: (async () =>
      (await city).name + ' - Splight'
    )(),
    header: {
      html: (async () =>
        mustache.render(headerTemplate, {name: (await city).name, path})
      )()
    },
    lead: {
      html: (async () =>
        mustache.render(leadTemplate, {name: (await city).name})
      )()
    }
  })
}

exports.make = make
