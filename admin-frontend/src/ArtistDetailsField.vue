<template>
  <b-row>
    <b-col md="2">
      {{ title }}&nbsp;:
    </b-col>
    <b-col>
      <slot/>
      <b-form-invalid-feedback>X {{ invalidFeedback }}</b-form-invalid-feedback>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    'title': {},
    'invalidFeedback': {}
  }
}
</script>
