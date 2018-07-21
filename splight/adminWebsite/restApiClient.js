'use strict'

const jQuery = require('jquery')

function addEvent ({citySlug, event}) {
  return jQuery.ajax(
    '/admin/api/cities/' + citySlug + '/events/',
    {
      data: JSON.stringify(event),
      contentType: 'application/json',
      type: 'POST',
      dataType: 'json'
    }
  )
}

Object.assign(exports, {addEvent})
