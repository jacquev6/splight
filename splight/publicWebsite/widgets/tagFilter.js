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
    const allTags = new Set(jQuery('#sp-tag-filtering input').map((index, input) => jQuery(input).val()).toArray())
    const query = URI.parseQuery(URI.parse(window.location.href).query)
    if (Object.keys(query).length === 0) {
      jQuery('#sp-tag-filtering input').prop('checked', true)
    } else {
      const displayedTags = new Set(Object.keys(query))
      jQuery('#sp-tag-filtering input').each(function (index, input) {
        input = jQuery(input)
        input.prop('checked', displayedTags.has(input.val()))
      })
    }

    function filterEvents () {
      jQuery('.sp-event').hide()
      const displayedTags = new Set()
      jQuery('#sp-tag-filtering input').each(function (index, input) {
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
    jQuery('#sp-tag-filtering input').on('change', filterEvents)
  }

  return {render, initialize}
}

Object.assign(exports, {make})
