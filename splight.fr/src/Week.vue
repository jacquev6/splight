<template>
  <sp-timespan :citySlug="citySlug" :startDate="startDate" :duration="duration" />
</template>

<script>
import moment from 'moment'
import durations from './durations'

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    },
    year: {
      required: true
    },
    week: {
      required: true
    }
  },
  data () {
    return {
      duration: durations.oneWeek
    }
  },
  computed: {
    startDate () {
      // @todo 404 when date is invalid
      return moment.utc(this.year + '-' + this.week, 'GGGG-WW', true)
    }
  }
}
</script>
