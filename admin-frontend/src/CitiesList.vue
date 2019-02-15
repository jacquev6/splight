<template>
  <!-- @todo Evaluate https://github.com/posva/vue-promised -->
  <ul v-if="cities">
    <li v-for="city in cities" :key="city.slug">
      <router-link :to="{name: 'city', params: {citySlug: city.slug}}">{{ city.name }}</router-link>
    </li>
  </ul>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    cities: {
      query: gql`{cities{slug name}}`
    }
  }
}
</script>
