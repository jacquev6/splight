<template>
  <b-container>
    <b-breadcrumb :items="breadcrumbItems"/>
    <slot/>
  </b-container>
</template>

<script>
export default {
  props: ['breadcrumbItems']
}
</script>
