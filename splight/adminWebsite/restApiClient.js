'use strict'

const jQuery = require('jquery')

function getArtists () {
  return jQuery.ajax(
    '/admin/api/artists/',
    {
      type: 'GET',
      dataType: 'json'
    }
  )
}

function getCities () {
  return jQuery.ajax(
    '/admin/api/cities/',
    {
      type: 'GET',
      dataType: 'json'
    }
  )
}

function getTags ({citySlug}) {
  return jQuery.ajax(
    '/admin/api/cities/' + citySlug + '/tags/',
    {
      type: 'GET',
      dataType: 'json'
    }
  )
}

function getLocations ({citySlug}) {
  return jQuery.ajax(
    '/admin/api/cities/' + citySlug + '/locations/',
    {
      type: 'GET',
      dataType: 'json'
    }
  )
}

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

Object.assign(exports, {getArtists, getCities, getTags, getLocations, addEvent})
