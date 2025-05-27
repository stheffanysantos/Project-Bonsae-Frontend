<template>
  <div class="bodyScreen">
    <div class="containerUploader">
      <h1>Vinculos</h1>
      <div class="content">
        <ul class="passos">
          <li>
            <h1 class="concluido">1</h1>
            <h3>Periodo letivo</h3>
          </li>
          <p><i class="arrow right"></i></p>
          <li>
            <h1 class="concluido">2</h1>
            <h3>Diciplina</h3>
          </li>
          <p><i class="arrow right"></i></p>
          <li>
            <h1 class="concluido">3</h1>
            <h3>Turmas</h3>
          </li>
          <p><i class="arrow right"></i></p>
          <li>
            <h1 class="concluido">4</h1>
            <h3>Usuarios</h3>
          </li>
          <p><i class="arrow right"></i></p>
          <li>
            <h1 class="concluido">5</h1>
            <h3>Vinculos</h3>
          </li>
        </ul>
        <br>
        <br>
        <h3>Vinculos Professores</h3>
        <CsvUploader />
        <h3>Vinculos Alunos</h3>
        <CsvUploader />
      </div>
      <button class="botaoNext">Finalizar</button>
    </div>
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
