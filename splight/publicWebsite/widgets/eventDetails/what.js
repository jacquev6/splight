'use strict'

const mustache = require('mustache')

const template = require('./what.html')

function render ({city, event: {artist, tags, title}}) {
  const event = {
    artist,
    tags: tags.map(({slug, title}) => ({slug, title, first: slug === tags[0].slug})),
    title
  }

  return mustache.render(template, {city, event})
}

Object.assign(exports, {render})
