<template>
  <spa-base :title="title" :feedback="feedback">
    <b-textarea :disabled="disabled" v-model="textValue" :state="feedback.state"/>
  </spa-base>
</template>

<script>
import Base from './Base.vue'

export default {
  components: {
    'spa-base': Base
  },
  props: {
    title: { required: true },
    feedback: { default () { return {} } },
    disabled: { default: false },
    value: {},
    splitter: { default () { return /\n\n+/ } },
    joiner: { default () { return '\n\n' } }
  },
  data () {
    return {
      textValue: this.join(this.value)
    }
  },
  watch: {
    value () {
      if (JSON.stringify(this.value) !== JSON.stringify(this.split(this.textValue))) {
        this.textValue = this.join(this.value)
      }
    },
    textValue () {
      this.$emit('input', this.split(this.textValue))
    }
  },
  methods: {
    split (textValue) {
      return textValue.split(this.splitter).map(part => part.trim()).filter(part => part !== '')
    },
    join (value) {
      return value.join(this.joiner)
    }
  }
}
</script>
