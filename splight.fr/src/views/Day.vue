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
    month: {
      required: true
    },
    day: {
      required: true
    }
  },
  data () {
    return {
      duration: 1
    }
  },
  computed: {
    startDate () {
      // @todo 404 when date is invalid
      return moment({ year: this.year, month: this.month, day: this.day })
    }
  }
}
</script>
