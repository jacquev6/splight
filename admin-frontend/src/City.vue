<template>
  <div>
    <p v-if="$apollo.loading">Chargement...</p>
    <div v-else>
      <h2>{{ city.name }} et sa région</h2>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: {
    citySlug: {
      type: String,
      required: true
    }
  },
  apollo: {
    city: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){name}}`,
      variables () {
        return {
          citySlug: this.citySlug
        }
      }
    }
  }
}
</script>
