'use strict'

const mustache = require('mustache')

const template = require('./container.html')

function make ({page, scripts}) {
  function render (data) {
    return mustache.render(
      template,
      {
        title: {
          text: page.title.text(data),
          html: page.title.render(data)
        },
        scripts,
        content: {
          html: page.content.render(data)
        }
      }
    )
  }

  return {render}
}

Object.assign(exports, {make})
