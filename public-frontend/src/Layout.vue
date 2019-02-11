<template>
  <b-container>
    <vue-headful :title="title"></vue-headful>
    <b-jumbotron :lead="lead" header-level="4">
      <template slot="header">
        <router-link :to="{name: 'cities'}">Splight</router-link>
        <slot name="subtitle"></slot>
      </template>
    </b-jumbotron>

    <slot name="content"></slot>

    <p>Copyright <a href="mailto:vincent@vincent-jacques.net">Vincent Jacques</a> 2018-2019.</p>
  </b-container>
</template>

<style lang="scss">
$sp-main-color-very-light: #9AB2E8;
// $sp-main-color-light: #5E81D2;
$sp-main-color: #3660C1;
// $sp-main-color-dark: #103FAC;
$sp-main-color-very-dark: #0A2B77;
$sp-complement-color-very-light: #FFDF9F;
// $sp-complement-color-light: #FFCB62;
$sp-complement-color: #FFBA31;
// $sp-complement-color-dark: #FFAA00;
$sp-complement-color-very-dark: #B17600;

$primary: $sp-main-color;
$secondary: $sp-complement-color;
@import "../node_modules/bootstrap/scss/bootstrap";

body {
  background-color: $sp-main-color-very-light;
}

.container {
  background-color: #fff;
  border: solid 3px $sp-complement-color;
}

.jumbotron {
  background-color: $sp-complement-color-very-light;
}

h1 {
  color: $sp-main-color-very-dark;
}

a {
  color: $sp-main-color;
}

// https://stackoverflow.com/a/25478589/905845
@function url-friendly-color($color) {
    @return '%23' + str-slice('#{$color}', 2, -1)
}

a[target=_blank] {
    background: center right no-repeat;
    background-image: url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' version='1.1'><path fill='%23fff' stroke='#{url-friendly-color($sp-main-color)}' d='M 0.5 3.5 L 8.5 3.5 L 8.5 11.5 L 0.5 11.5 Z M 0.5 3.5'/><path fill='%23fff' stroke='#{url-friendly-color($sp-main-color)}' d='M 5 9 L 9.5 4.5 L 11.5 6.5 L 11.5 0.5 L 5.5 0.5 L 7.5 2.5 L 3 7 Z M 5 9'/></svg>");
    padding-right: 18px;
}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    lead: {
      type: String,
      required: true
    }
  }
}
</script>
