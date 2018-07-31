'use strict'

const mustache = require('mustache')

const paths = require('../paths')
const template = require('./rootContent.html')

function make () {
  function render (data) {
    return mustache.render(
      template,
      {
        cities: data.cities.map(
          ({slug, name}) => ({slug, name, path: paths.city(slug)})
        )
      }
    )
  }

  function initialize () {
  }

  return {render, initialize}
}

Object.assign(exports, {make})
