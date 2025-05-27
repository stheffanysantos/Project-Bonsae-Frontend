<template>
  <FundoAnimado id="app">
    <router-view />
  </FundoAnimado>
</template>

<script>
import FundoAnimado from './components/fundoAnimado.vue';
export default {
  components: {
    FundoAnimado,
  },
  name: 'App'
}
</script>

<style>
nav {
  margin-bottom: 20px;
}

@import './assets/css/style.css';
</style>
