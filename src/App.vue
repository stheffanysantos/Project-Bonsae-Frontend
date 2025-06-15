<template>
  <div id="app">
    <HeaderTopo />
    <router-view />
    <FooterPage/>
  </div>
</template>

<script>
import HeaderTopo from './components/HeaderTopo.vue'
import FooterPage from './components/FotterPage.vue'

export default {
  components: {
    HeaderTopo,
    FooterPage
  }
}
</script>