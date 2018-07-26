'use strict'

const mustache = require('mustache')

const template = '<h1 class="display-4">{{{header.html}}}</h1><p class="lead">{{{lead.html}}}</p>'

function make ({text, header, lead}) {
  function render (data) {
    return mustache.render(
      template,
      {
        header: {html: header.render(data)},
        lead: {html: lead.render(data)}
      }
    )
  }

  function initialize () {
  }

  return {text, render, initialize}
}

exports.make = make
