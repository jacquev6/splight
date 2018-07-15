'use strict'

/* global history, setTimeout */

const $ = global.jQuery = require('jquery')
require('bootstrap')
const moment = require('moment')
const URI = require('urijs')

const source = (function () {
  const fetchCities = (function () {
    var cities = null

    return async function () {
      if (!cities) {
        cities = await $.getJSON('/cities.json')
        Object.entries(cities).forEach(([slug, city]) => {
          city.slug = slug
          city.firstDate = moment(city.firstDate, 'YYYY-MM-DD', true)
          Object.entries(city.tags).forEach(([slug, tag]) => {
            tag.slug = slug
          })
        })
      }
      return cities
    }
  }())

  const fetchWeek = (function () {
    var weeks = {}

    return async function (citySlug, weekSlug) {
      const key = citySlug + '/' + weekSlug
      if (weeks[key] === undefined) {
        const data = await $.getJSON('/' + key + '.json')
        data.events.forEach(event => {
          event.start = moment(event.start)
        })
        weeks[key] = data.events
      }
      return weeks[key]
    }
  }())

  // @todo Prefetch cities, then when loading cityIndex, prefetch current week, then on a week, prefetch previous and next weeks

  async function getCities () {
    return Object.values((await fetchCities())).map(({slug, name}) => ({slug, name}))
  }

  async function getCity (citySlug) {
    const {slug, name, firstDate} = (await fetchCities())[citySlug]
    return {slug, name, firstDate}
  }

  async function getTags (citySlug) {
    return Object.values((await fetchCities())[citySlug].tags).sort(
      (tag1, tag2) => tag1.displayOrder - tag2.displayOrder
    ).map(
      ({slug, title}) => ({slug, title})
    )
  }

  async function getEvents (citySlug, startDate, dateAfter) {
    const weekSlugs = []
    for (var d = startDate.clone().startOf('isoWeek'); d.isBefore(dateAfter); d.add(7, 'days')) {
      weekSlugs.push(d.format('GGGG-[W]WW'))
    }
    var weeks = await Promise.all(weekSlugs.map(weekSlug => fetchWeek(citySlug, weekSlug)))
    return [].concat.apply([], weeks).filter(({start}) => start.isBetween(startDate, dateAfter, null, '[)'))
  }

  return {getCities, getCity, getTags, getEvents}
}())

const pages = require('../../pages')(source)

$(async function () {
  const page = pages.fromUrl(window.location.href)

  function handleInternalLinkClick (event) {
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return true
    } else {
      const path = $(this).attr('href')
      $('.sp-modern').addClass('sp-loading')
      const page = pages.fromUrl(path)

      page.make().then(async ({title, jumbotron, content}) => {
        $('title').text(title)
        $('#sp-jumbotron').html(jumbotron)
        $('#sp-content').html(content)

        $("#sp-jumbotron a[href^='/'], #sp-content a[href^='/']").on('click', handleInternalLinkClick)
        await page.initializeInBrowser()
        history.replaceState(null, window.document.title, URI(window.location.href).path(path).toString())
        $('.sp-modern').removeClass('sp-loading')
      })

      return false
    }
  }

  $("a[href^='/']").on('click', handleInternalLinkClick)
  await page.initializeInBrowser()
  $('.sp-modern').removeClass('sp-loading')
})
