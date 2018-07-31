'use strict'

const assert = require('assert').strict
const moment = require('moment')

// @todo Remove when fix for https://github.com/moment/moment/issues/4698 is on npm
assert.equal(moment.HTML5_FMT.WEEK, 'GGGG-[W]WW')

const oneDay = (function () {
  function clip (d) {
    return d.clone().startOf('day')
  }

  return {
    days: 1,
    name: 'une journée',
    clip,
    titleFormat: '[Journée du] dddd LL',
    slugFormat: moment.HTML5_FMT.DATE,
    dateAfter: startDate => clip(startDate).add(1, 'day'),
    links: {
      previous: {text: 'Journée précédente', startDate: startDate => clip(startDate).subtract(1, 'day')},
      next: {text: 'Journée suivante', startDate: startDate => clip(startDate).add(1, 'day')},
      now1: {text: "Aujourd'hui", startDate: now => clip(now)},
      now2: {text: 'Demain', startDate: now => clip(now).add(1, 'day')}
    }
  }
}())

const threeDays = (function () {
  function clip (d) {
    return d.clone().startOf('day')
  }

  return {
    days: 3,
    name: 'trois jours',
    clip,
    titleFormat: '[3 jours à partir du] dddd LL',
    slugFormat: moment.HTML5_FMT.DATE + '+2',
    dateAfter: startDate => clip(startDate).add(3, 'days'),
    links: {
      previous: {text: 'Jours précédents', startDate: startDate => clip(startDate).subtract(1, 'day')},
      next: {text: 'Jours suivants', startDate: startDate => clip(startDate).add(1, 'day')},
      now1: {text: 'Ces 3 jours', startDate: now => clip(now)},
      now2: {text: 'Le week-end prochain', startDate: now => clip(now).add(3, 'days').startOf('isoWeek').add(4, 'days')}
    }
  }
}())

const oneWeek = (function () {
  function clip (d) {
    return d.clone().startOf('isoWeek')
  }

  return {
    days: 7,
    name: 'une semaine',
    clip,
    slugFormat: moment.HTML5_FMT.WEEK,
    titleFormat: '[Semaine du] dddd LL',
    dateAfter: startDate => clip(startDate).add(7, 'days'),
    links: {
      previous: {text: 'Semaine précédente', startDate: startDate => clip(startDate).subtract(7, 'days')},
      next: {text: 'Semaine suivante', startDate: startDate => clip(startDate).add(7, 'days')},
      now1: {text: 'Cette semaine', startDate: now => clip(now)},
      now2: {text: 'La semaine prochaine', startDate: now => clip(now).add(7, 'days')}
    }
  }
}())

const allByName = {oneDay, threeDays, oneWeek}
const all = Object.values(allByName)

const byDays = {}
all.forEach(d => {
  byDays[d.days] = d
})

Object.assign(exports, allByName, {all, byDays})
