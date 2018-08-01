'use strict'

/* global history */

const jQuery = require('jquery')
const mustache = require('mustache')
const URI = require('urijs')

const template = require('./tagFilter.html')

function make ({citySlug}) {
  function render ({city}) {
    return mustache.render(
      template,
      {
        city
      }
    )
  }

  function initialize () {
    const inputs = jQuery('#sp-tag-filtering input')
    const allTags = new Set(inputs.map((index, input) => jQuery(input).val()).toArray())
    const queryKeys = Object.keys(URI.parseQuery(URI.parse(window.location.href).query))
    if (queryKeys.length === 0) {
      // Default checked state cannot be done in markup because some browsers will cache and restore checkboxes' state
      inputs.prop('checked', true)
      inputs.parent('label').addClass('active')
    } else {
      const displayedTags = new Set(queryKeys)
      inputs.each(function (index, input) {
        input = jQuery(input)
        input.prop('checked', displayedTags.has(input.val()))
        input.parent('label').toggleClass('active', displayedTags.has(input.val()))
      })
    }

    function filterEvents () {
      jQuery('.sp-event').hide()
      const displayedTags = new Set()
      inputs.each(function (index, input) {
        input = jQuery(input)
        const tag = input.val()
        if (input.prop('checked')) {
          displayedTags.add(tag)
          jQuery('.sp-tag-' + citySlug + '-' + tag).show()
        }
      })

      const newQuery = displayedTags.size === allTags.size ? '' : Array.from(displayedTags).sort().join('&')
      jQuery('.sp-tag-filtering-tagged-link').attr('href', function (index, href) {
        return URI(href).query(newQuery).toString()
      })
      history.replaceState(null, '', URI(window.location.href).query(newQuery).toString())
    }

    filterEvents()
    inputs.on('change', filterEvents)
  }

  return {render, initialize}
}

Object.assign(exports, {make})
