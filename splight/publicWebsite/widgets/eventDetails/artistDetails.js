'use strict'

const mustache = require('mustache')

const template = `
  <p>{{artist.name}}</p>
  {{#artist.description}}<p class="text-justify">{{.}}</p>{{/artist.description}}
  {{#artist.website}}<p><a href="{{{.}}}" target="_blank">Site officiel</a></p>{{/artist.website}}
`

function render ({artist}) {
  return mustache.render(template, {artist})
}

Object.assign(exports, {render})
