'use strict'

const mustache = require('mustache')

const artistDetails = require('./artistDetails')
const template = `
  <p>{{#tags}}{{^first}} {{/first}}<span class="sp-small-tag sp-main-tag-{{city.slug}}-{{slug}}">{{title}}</span>{{/tags}}</p>
  <p>{{title}}</p>
  {{{artist.details.html}}}
`

function render ({city, event: {artist, tags, title}}) {
  return mustache.render(template, {
    tags: tags.map(({slug, title}) => ({slug, title, first: slug === tags[0].slug})),
    city,
    title,
    artist: {details: {html: artistDetails.render({artist})}}
  })
}

Object.assign(exports, {render})
