<template>
  <b-container>
    <router-view/>

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
</style>
