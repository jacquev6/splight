<template>
  <div>
    <h1>{{ city.name }}</h1>
    <p><img :src="city.allTagsImage" />Toutes les catégories</p>
    <p v-for="tag in city.tags" :key="tag.slug"><img :src="tag.image" />{{ tag.title }}</p>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  props: [
    'citySlug'
  ],
  apollo: {
    city: {
      query: gql`query($citySlug:ID!){city(slug:$citySlug){slug name tags{slug title image} allTagsImage}}`,
      variables() {
        return {
          citySlug: this.citySlug
        }
      }
    }
  }
}
</script>
