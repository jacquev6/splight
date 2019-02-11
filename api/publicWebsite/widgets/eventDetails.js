'use strict'

const mustache = require('mustache')

const template = require('./eventDetails.html')

function make ({when, what, where}) {
  function render (data) {
    return mustache.render(
      template,
      Object.assign(
        {
          when: {html: when.render(data), postTitleHtml: when.renderPostTitle && when.renderPostTitle(data)},
          what: {html: what.render(data), postTitleHtml: what.renderPostTitle && what.renderPostTitle(data)},
          where: {html: where.render(data), postTitleHtml: where.renderPostTitle && where.renderPostTitle(data)}
        },
        data
      )
    )
  }

  return {render}
}

Object.assign(exports, {make})
