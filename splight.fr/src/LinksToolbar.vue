<template>
  <b-navbar toggleable="md" type="light" variant="secondary">
    <b-navbar-nav>
      <b-nav-item :to="links.prev.to">&lt; {{ links.prev.text }}</b-nav-item>
      <b-nav-item :to="links.next.to">{{ links.next.text }} &gt;</b-nav-item>
    </b-navbar-nav>
    <b-navbar-toggle target="sp-navbar-collapse" />
    <b-collapse is-nav id="sp-navbar-collapse">
      <b-navbar-nav>
        <b-nav-item-dropdown text="Durée affichée">
          <b-dropdown-item v-for="d in durations" :key="d.days" href="" :active="d == duration">{{ d.name }}</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown  text="Aller à">
          <b-dropdown-item :href="links.now1.href">{{ links.now1.text }}</b-dropdown-item>
          <b-dropdown-item :href="links.now2.href">{{ links.now2.text }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import durations from './durations'

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    },
    startDate: {
      required: true
    },
    duration: {
      required: true
    }
  },
  data () {
    return {
      durations: [durations.oneWeek, durations.threeDays, durations.oneDay]
    }
  },
  computed: {
    tags () {
      return Object.keys(this.$route.query)
    },
    links () {
      return {
        prev: {
          text: this.duration.links.prev.text,
          to: this.duration.links.prev.to(this.citySlug, this.startDate)
        },
        next: {
          text: this.duration.links.next.text,
          // to: this.duration.links.next.to(this.startDate)
          href: '/'
        },
        now1: {
          text: this.duration.links.now1.text,
          href: '/'
        },
        now2: {
          text: this.duration.links.now2.text,
          href: '/'
        }
      }
    }
  }
}
</script>
