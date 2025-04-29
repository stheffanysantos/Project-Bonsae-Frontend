<template>
  <div class="containerUploader">
    <h1>Menu</h1>
    <div class="contentMenu">
      <div class="btMenu">
        <h3>Historico</h3>
        <img class="imgBMenu" src="../assets/img/historicoIcon.svg" alt="">
      </div>
      <div class="btMenu">
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
    goDiciplinas() {
      this.$router.push('/Disciplinas');
    }
  }
}
</script>

<style></style>
