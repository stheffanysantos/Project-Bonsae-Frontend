<template>
  <div class="containerUploader">
    <h1>Menu</h1>
    <div class="contentMenu">
      <div class="btMenu" @click="goHistorico">
        <h3>Historico</h3>
        <img class="imgBMenu" src="../assets/img/historicoIcon.svg" alt="">
      </div>
      <div class="btMenu" @click="goPeriodo">
        <h3>uploader</h3>
        <img class="imgBMenu" src="../assets/img/uploadeIcon.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {

  },
  methods: {
    goPeriodo() {
      this.$router.push('/periodo');
    },
    goHistorico() {
      this.$router.push('/historico');
    }
  }
}
</script>

<style></style>
