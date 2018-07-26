'use strict'

const mustache = require('mustache')

const paths = require('../paths')
const title = require('./title')

const headerTemplate = '<a href="/">Splight</a> - <a href="{{{path}}}">{{name}}</a>'
const leadTemplate = 'Votre agenda culturel à {{name}} et dans sa région'

function make ({citySlug}) {
  const path = paths.city(citySlug)

  return title.make({
    text: data => data.city.name + ' - Splight',
    header: {
      render: data => mustache.render(headerTemplate, {name: data.city.name, path})
    },
    lead: {
      render: data => mustache.render(leadTemplate, {name: data.city.name})
    }
  })
}

exports.make = make
