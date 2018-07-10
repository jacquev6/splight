'use strict'

const moment = require('moment')

exports.make = function (timespanSlug) {
  if (timespanSlug.length === 10) {
    const format = moment.HTML5_FMT.DATE
    const startDate = moment(timespanSlug, format)
    return {
      duration: 'Journée',
      startDate,
      dateAfter: startDate.clone().add(1, 'days'),
      previousLinkText: 'Journée précédente',
      previousLinkSlug: startDate.clone().subtract(1, 'days').format(format),
      nextLinkText: 'Journée suivante',
      nextLinkSlug: startDate.clone().add(1, 'days').format(format),
      now1LinkText: "Aujourd'hui",
      now1LinkSlug: now => now.format(format),
      now2LinkText: 'Demain',
      now2LinkSlug: now => now.clone().add(1, 'days').format(format)
    }
  } else if (timespanSlug.length === 12) {
    const format = moment.HTML5_FMT.DATE + '+2'
    const startDate = moment(timespanSlug, format)
    return {
      duration: '3 jours à partir',
      startDate,
      dateAfter: startDate.clone().add(3, 'days'),
      previousLinkText: 'Jours précédents',
      previousLinkSlug: startDate.clone().subtract(1, 'days').format(format),
      nextLinkText: 'Jours suivants',
      nextLinkSlug: startDate.clone().add(1, 'days').format(format),
      now1LinkText: 'Ces 3 jours',
      now1LinkSlug: now => now.format(format),
      now2LinkText: 'Le week-end prochain',
      now2LinkSlug: now => now.clone().add(3, "days").startOf("isoWeek").add(4, "days").format(format)
    }
  } else if (timespanSlug.length === 8) {
    const format = moment.HTML5_FMT.WEEK
    const startDate = moment(timespanSlug, format)
    return {
      duration: 'Semaine',
      startDate,
      dateAfter: startDate.clone().add(7, 'days'),
      previousLinkText: 'Semaine précédente',
      previousLinkSlug: startDate.clone().subtract(7, 'days').format(format),
      nextLinkText: 'Semaine suivante',
      nextLinkSlug: startDate.clone().add(7, 'days').format(format),
      now1LinkText: 'Cette semaine',
      now1LinkSlug: now => now.format(format),
      now2LinkText: 'La semaine prochaine',
      now2LinkSlug: now => now.clone().add(7, 'days').format(format)
    }
  } else {
    throw Error(`Wrong timespan slug: ${timespanSlug}`)
  }
}
