<template>
  <div class="containerUploader">
    <h1>Turmas</h1>
    <div class="content">
      <ul class="passos">
        <li>
          <h1 class="concluido">1</h1>
          <h3>Periodo letivo</h3>
        </li>
        <hr>
        <li>
          <h1 class="concluido">2</h1>
          <h3>Diciplina</h3>
        </li>
        <hr>
        <li>
          <h1 class="concluido">3</h1>
          <h3>Turmas</h3>
        </li>
        <hr>
        <li>
          <h1>4</h1>
          <h3>Usuarios</h3>
        </li>
      </ul>
      <CsvUploader />
    </div>
    <button @click="goUsuarios">Proximo</button>
  </div>
</template>

<script>
import CsvUploader from '@/components/CsvUploader.vue';
export default {
  name: 'App',
  components: {
    CsvUploader,
  },
  methods: {
    goUsuarios() {
      this.$router.push('/usuarios');
    }
  }
}
</script>

<style></style>
