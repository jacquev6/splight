'use strict'

const jQuery = require('jquery')
const mustache = require('mustache')

const addEventForm_ = require('./widgets/addEventForm')
const restApiClient = require('./restApiClient')
const template = require('./body.html')
const utils = require('./utils')

const {fillSelect} = utils

function make () {
  const publicIFrame = {
    show: function (path) {
      jQuery('#spa-public').attr('src', path)
    }
  }
  const addEventForm = addEventForm_.make({publicIFrame})

  const html = mustache.render(
    template,
    {
      addEventForm
    }
  )

  async function initialize () {
    const select = jQuery('#spa-select-city')

    select.on('change', async () => {
      jQuery('#spa-city').hide()
      const citySlug = select.val()
      if (citySlug !== '-') {
        await addEventForm.initialize(citySlug)
        jQuery('#spa-city').show()
      }
    })

    fillSelect(
      select,
      (await restApiClient.getCities()).map(({slug, name}) =>
        ({value: slug, display: name})
      )
    )
  }

  return {html, initialize}
}

exports.make = make
