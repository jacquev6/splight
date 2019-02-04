<template>
  <div>
    <h1>Cities</h1>
    <p v-for="city in cities"><router-link :key="city.slug" :to="{name: 'city', params: {citySlug: city.slug}}"><img :src="city.image" />{{ city.name }}</router-link></p>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    cities: gql`{cities{slug name image}}`
  }
}
</script>
