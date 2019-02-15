<template>
  <b-row>
    <b-col md="2">
      {{ title }}&nbsp;:
    </b-col>
    <b-col>
      <slot/>
      <b-form-invalid-feedback>{{ feedback.invalid }}</b-form-invalid-feedback>
    </b-col>
  </b-row>
</template>

<script>
export default {
  props: {
    title: { required: true },
    feedback: { default () { return {} } }
  }
}
</script>
