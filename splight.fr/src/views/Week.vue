<template>
  <sp-timespan :citySlug="citySlug" :startDate="startDate" :duration="duration" />
</template>

<script>
import moment from 'moment'

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
      duration: 7
    }
  },
  computed: {
    startDate () {
      // @todo 404 when date is invalid
      return moment(this.year + '-' + this.week, 'GGGG-WW', true)
    }
  }
}
</script>
