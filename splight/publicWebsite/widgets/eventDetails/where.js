'use strict'

const mustache = require('mustache')

const template = `
  <p>{{location.name}}</p>
  {{#location.description}}<p class="text-justify">{{.}}</p>{{/location.description}}
  {{#location.website}}<p><a href="{{{.}}}" target="_blank">Site officiel</a></p>{{/location.website}}
`

function render ({event: {location}}) {
  return mustache.render(template, {location})
}

Object.assign(exports, {render})
