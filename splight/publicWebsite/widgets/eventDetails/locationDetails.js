'use strict'

const mustache = require('mustache')

const template = `
  <p>{{location.name}}</p>
  {{#location.image}}<p><img class="img-fluid" src="{{.}}" /></p>{{/location.image}}
  {{#location.description}}<p class="text-justify">{{.}}</p>{{/location.description}}
  {{#location.website}}<p><a href="{{{.}}}" target="_blank">Site officiel</a></p>{{/location.website}}
  {{#location.phone}}<p>{{{.}}}</p>{{/location.phone}}
  {{#location.hasAddress}}<p>{{#location.address}}{{.}}<br>{{/location.address}}</p>{{/location.hasAddress}}
`

function render ({location}) {
  const hasAddress = location && location.address.length !== 0
  return mustache.render(template, {location: Object.assign({hasAddress}, location)})
}

Object.assign(exports, {render})
