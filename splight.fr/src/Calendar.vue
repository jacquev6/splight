<template>
  <div>
    <b-row>
      <b-col v-for="day in days" :key="day.date.format(moment.HTML5_FMT.DATE)" :md="true">
        <p v-if="days.length > 1"><strong>{{ day.date.format('ddd Do MMM') }}</strong></p>
        <div v-for="event in day.events" :key="event.id"
          class="sp-event"
          :class="event.clazz"
          :data-sp-event-id="event.id"
        >
          <p><strong>{{ event.time }}</strong>{{ ' ' }}<span class="sp-event-title">{{ event.title }}</span></p>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<style scoped lang="scss">
.sp-event {
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;

  margin-top: 3px;
  margin-bottom: 3px;
  margin-left: -10px;
  margin-right: -10px;
}

.sp-event > * {
  margin: 3px;
}

// @todo Factorize with TagFilter
@for $size from 1 through 30 {
  @for $index from 1 through $size {
    $color: hsl(($index - 1) / $size * 360, 100%, 50%);

    .sp-main-tag-#{$index}-#{$size} {
      background-color: lighten($color, 40%);
      border-color: lighten($color, 20%);
    }
  }
}
</style>

<script>
import moment from 'moment'

export default {
  props: {
    startDate: {
      required: true
    },
    dateAfter: {
      required: true
    },
    city: {
      required: true
    }
  },
  data () {
    return {
      moment
    }
  },
  computed: {
    tagClasses () {
      const tagClasses = {}
      this.city.tags.forEach(({ slug }, index) => {
        tagClasses[slug] = 'sp-main-tag-' + (index + 1) + '-' + this.city.tags.length
      })
      return tagClasses
    },
    days () {
      const dayEventsByDate = {}

      // @todo Factorize with TagFilter
      const allTagSlugs = new Set(this.city.tags.map(({ slug }) => slug))
      const activeTagSlugs = new Set(Object.keys(this.$route.query).filter(slug => allTagSlugs.has(slug)))
      const allTagsAreActive = activeTagSlugs.size === 0 || activeTagSlugs.size === allTagSlugs.size

      this.city.events.forEach(({ id, location, artist, occurrences, tags, title: eventTitle }) => {
        occurrences.forEach(({ start }) => {
          start = moment(start)

          const day = start.format(moment.HTML5_FMT.DATE)
          var dayEvents = dayEventsByDate[day]
          if (!dayEvents) {
            dayEventsByDate[day] = dayEvents = []
          }

          const title = [eventTitle, artist && artist.name, location && location.name].filter(x => x).join(', ')

          // @todo Factorize with TagFilter
          if (allTagsAreActive || tags.some(({ slug }) => activeTagSlugs.has(slug))) {
            dayEvents.push({
              id,
              time: start.format(moment.HTML5_FMT.TIME),
              title,
              clazz: this.tagClasses[tags[0].slug]
            })
          }
        })
      })

      const days = []
      for (var date = this.startDate.clone(); date.isBefore(this.dateAfter); date.add(1, 'day')) {
        days.push({
          date: date.clone(),
          events: (dayEventsByDate[date.format(moment.HTML5_FMT.DATE)] || []).sort(
            (a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0
          )
        })
      }
      return days
    }
  }
}
</script>
