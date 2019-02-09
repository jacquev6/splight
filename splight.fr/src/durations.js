import moment from 'moment'

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
      prev: {
        text: 'Journée précédente',
        to (citySlug, startDate) {
          const newStartDate = clip(startDate).subtract(1, 'day')
          return {
            name: 'week',
            params: {
              citySlug,
              year: newStartDate.format('GGGG'),
              week: newStartDate.format('WW'),
              duration: oneWeek
            }
          }
        }
      },
      next: { text: 'Journée suivante', startDate: startDate => clip(startDate).add(1, 'day') },
      now1: { text: "Aujourd'hui", startDate: now => clip(now) },
      now2: { text: 'Demain', startDate: now => clip(now).add(1, 'day') }
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
      prev: {
        text: 'Jours précédents',
        to (citySlug, startDate) {
          const newStartDate = clip(startDate).subtract(1, 'day')
          return {
            name: 'week',
            params: {
              citySlug,
              year: newStartDate.format('GGGG'),
              week: newStartDate.format('WW'),
              duration: oneWeek
            }
          }
        }
      },
      next: { text: 'Jours suivants', startDate: startDate => clip(startDate).add(1, 'day') },
      now1: { text: 'Ces 3 jours', startDate: now => clip(now) },
      now2: { text: 'Le week-end prochain', startDate: now => clip(now).add(3, 'days').startOf('isoWeek').add(4, 'days') }
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
      prev: {
        text: 'Semaine précédente',
        to (citySlug, startDate) {
          const newStartDate = clip(startDate).subtract(7, 'days')
          return {
            name: 'week',
            params: {
              citySlug,
              year: newStartDate.format('GGGG'),
              week: newStartDate.format('WW'),
              duration: oneWeek
            }
          }
        }
      },
      next: { text: 'Semaine suivante', startDate: startDate => clip(startDate).add(7, 'days') },
      now1: { text: 'Cette semaine', startDate: now => clip(now) },
      now2: { text: 'La semaine prochaine', startDate: now => clip(now).add(7, 'days') }
    }
  }
}())

export default { oneDay, threeDays, oneWeek }
