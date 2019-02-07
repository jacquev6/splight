<template>
  <div>
    <vue-headful :title="title"></vue-headful>
    <b-jumbotron lead="Votre agenda culturel régional" header-level="4">
      <template slot="header">
        <router-link :to="{name: 'cities'}">Splight</router-link>
        <slot name="subtitle"></slot>
      </template>
    </b-jumbotron>

    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  props: {
    'title': {
      type: String,
      required: true
    }
  }
}
</script>
