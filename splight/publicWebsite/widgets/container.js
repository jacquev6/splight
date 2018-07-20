'use strict'

const mustache = require('mustache')

const template = require('./container.html')

function make ({page, scripts}) {
  return {
    html: (async () => {
      return mustache.render(
        template,
        {
          title: {
            text: await page.title.text,
            html: await page.title.html
          },
          scripts,
          content: {
            html: await page.content.html
          }
        }
      )
    })()
  }
}

exports.make = make
