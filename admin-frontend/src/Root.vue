<template>
  <spa-layout :breadcrumbItems="breadcrumbItems">
    <b-row>
      <b-col><h1><router-link :to="{name: 'artists'}">Artistes</router-link></h1></b-col>
      <!-- <b-col><h1><router-link :to="{name: 'cities'}">Villes</router-link></h1></b-col> -->
    </b-row>
  </spa-layout>
</template>

<script>
export default {
  data () {
    return {
      breadcrumbItems: [
        { text: 'Admin', to: { name: 'root' } }
      ]
    }
  }
}
</script>
