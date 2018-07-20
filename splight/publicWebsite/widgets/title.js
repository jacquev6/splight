'use strict'

const mustache = require('mustache')

const template = '<h1 class="display-4">{{{header.html}}}</h1><p class="lead">{{{lead.html}}}</p>'

function make ({text, header, lead}) {
  return {
    text,
    html: (async () =>
      mustache.render(template, {header: {html: await header.html}, lead: {html: await lead.html}})
    )(),
    initialize: () => undefined
  }
}

exports.make = make
