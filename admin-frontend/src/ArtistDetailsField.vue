<template>
  <p><label>{{ title }}&nbsp;:
    <slot/>
    <b-form-invalid-feedback>{{ invalidFeedback }}</b-form-invalid-feedback>
  </label></p>
</template>

<script>
export default {
  props: {
    'title': {},
    'invalidFeedback': {}
  }
}
</script>
