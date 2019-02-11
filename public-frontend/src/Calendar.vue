<template>
  <div>
    <b-row>
      <b-col v-for="day in days" :key="day.date.format(moment.HTML5_FMT.DATE)" :md="true">
        <p v-if="days.length > 1"><strong>{{ day.date.format('ddd Do MMM') }}</strong></p>
        <router-link v-for="event in day.events" :key="event.id"
          class="sp-event text-reset"
          :class="event.clazz"
          :data-sp-event-id="event.id"
         :to="event.to"
        >
          <p><strong>{{ event.time }}</strong>{{ ' ' }}<span class="sp-event-title">{{ event.title }}</span></p>
        </router-link>
      </b-col>
    </b-row>

    <b-modal
      v-if="detailedEvent != null"
      centered size="lg"
      :hide-footer="true"
      :title="detailedEvent.title"
      :visible="true"
      @hidden="eventDetailHidden"
    >
      <h3>Quand&nbsp;?</h3>
      <ul>
        <li v-for="occurrence in detailedEvent.occurrences" :key="occurrence.start">Le {{ moment(occurrence.start).format('ddd Do MMM') }} à {{ moment(occurrence.start).format('LT') }}</li>
      </ul>
      <b-row>
        <b-col>
          <h3>Quoi, qui&nbsp;?</h3>
          <p><span v-for="tag in detailedEvent.tags" :key="tag.slug">
            <span class="sp-small-tag" :class="tagClasses[tag.slug]">{{ tag.title }}</span>{{ ' ' }}
          </span></p>
          <p>{{ detailedEvent.title }}</p>
          <template v-if="detailedEvent.artist !== null">
            <p>{{ detailedEvent.artist.name }}</p>
            <p v-if="detailedEvent.reservationPage"><a :href="detailedEvent.reservationPage" target="_blank">Réserver en ligne</a></p>
            <p v-if="detailedEvent.artist.image"><b-img fluid :src="detailedEvent.artist.image" /></p>
            <p v-for="line in detailedEvent.artist.description" :key="line" class="text-justify">{{ line }}</p>
            <p v-if="detailedEvent.artist.website"><a :href="detailedEvent.artist.website" target="_blank">Site officiel</a></p>
          </template>
        </b-col>
        <b-col>
          <h3>Où&nbsp;?</h3>
          <p>{{ detailedEvent.location.name }}</p>
          <p v-if="detailedEvent.location.image"><b-img fluid :src="detailedEvent.location.image" /></p>
          <p v-for="line in detailedEvent.location.description" :key="line" class="text-justify">{{ line }}</p>
          <p v-if="detailedEvent.location.website"><a :href="detailedEvent.location.website" target="_blank">Site officiel</a></p>
          <p v-if="detailedEvent.location.phone">{{ detailedEvent.location.phone }}</p>
          <p v-if="detailedEvent.location.address.length > 0">
            <span v-for="line in detailedEvent.location.address" :key="line">{{ line }}<br/></span>
          </p>
        </b-col>
      </b-row>
    </b-modal>
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

  display: block;
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

.sp-small-tag {
  font-size: 90%;
  border-radius: 3px;
  border-width: 1px;
  border-style: solid;
  padding-left: 3px;
  padding-right: 3px;
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
    },
    // @todo Rethink props, especially timespan introduces weird coupling with Timespan view
    timespan: {
      required: true
    },
    eventId: {
      default: null
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
              clazz: this.tagClasses[tags[0].slug],
              to: {
                name: 'eventDetail',
                params: {
                  citySlug: this.city.slug,
                  eventId: id
                },
                query: this.$route.query
              }
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
    },
    detailedEvent () {
      const detailedEvent = this.city.events.filter(({ id }) => id === this.eventId)
      if (detailedEvent.length === 1) {
        return detailedEvent[0]
      } else {
        return null
      }
    }
  },
  methods: {
    eventDetailHidden () {
      // @todo Find a way to avoid that Calendar knows how to go to timespan route
      this.$router.push({
        name: 'timespan',
        params: {
          citySlug: this.city.slug,
          timespan: this.timespan
        },
        query: this.$route.query
      })
    }
  }
}
</script>
