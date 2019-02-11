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
          <b-dropdown-item v-for="d in links.durations" :key="d.name" :to="d.to">{{ d.name }}</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown  text="Aller à">
          <b-dropdown-item :to="links.now1.to">{{ links.now1.text }}</b-dropdown-item>
          <b-dropdown-item :to="links.now2.to">{{ links.now2.text }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  props: {
    links: {
      required: true
    }
  }
}
</script>
