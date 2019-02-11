<template>
  <div>
    <p v-if="$apollo.loading">Chargement...</p>
    <div v-else>
      <h2>Villes</h2>
      <b-row>
        <b-col v-for="city in cities" :key="city.slug" cols="6" md="3">
          <p><router-link :to="{name: 'city', params: {citySlug: city.slug}}"><img class="img-fluid" :alt="city.name" :src="city.image" /></router-link></p>
          <p><router-link :to="{name: 'city', params: {citySlug: city.slug}}">{{ city.name }}</router-link></p>
        </b-col>
      </b-row>
    </div>
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
