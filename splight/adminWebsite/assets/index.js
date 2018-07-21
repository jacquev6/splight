'use strict'

const bootstrap = require('bootstrap') // eslint-disable-line
const jQuery = require('jquery')
const moment = require('moment')
const moment_fr = require('moment/locale/fr') // eslint-disable-line

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
moment.HTML5_FMT.WEEK = 'GGGG-[W]WW'

const restApiClient = require('../restApiClient')

jQuery(function () {
  jQuery('#spa-add-event').on('submit', function () {
    const citySlug = 'avalon'
    const event = {
      occurences: [
        {start: moment().format(moment.HTML5_FMT.DATETIME_LOCAL)}
      ],
      title: 'Foo bar baz',
      tags: ['tag-1'],
      location: 'location-1'
    }

    restApiClient.addEvent({citySlug, event}).then(function (response) {
      jQuery('#spa-public').attr('src', response.visible_at[0])
    })

    return false
  })
})
