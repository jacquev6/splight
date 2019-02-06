<template>
  <div>
    <b-row><b-col>
      <p><router-link :to="{name: 'cities'}"><img class="img-fluid" alt="Toute l'actualité" :src="city.allTagsImage" /></router-link></p>
      <p><router-link :to="{name: 'cities'}">Toute l'actualité</router-link></p>
    </b-col></b-row>

    <b-row><b-col>
      <h1>Catégories</h1>
    </b-col></b-row>

    <b-row>
      <b-col v-for="tag in city.tags" :key="tag.slug" cols="6" md="3">
        <p><router-link :to="{name: 'cities'}"><img class="img-fluid" :alt="tag.title" :src="tag.image" /></router-link></p>
        <p><router-link :to="{name: 'cities'}">{{ tag.title }}</router-link></p>
      </b-col>
    </b-row>
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
      variables () {
        return {
          citySlug: this.citySlug
        }
      }
    }
  }
}
</script>
