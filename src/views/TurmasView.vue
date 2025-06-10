<template>
  <div class="bodyScreen">
    <div class="containerUploader">
      <h1>Turmas</h1>
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
            <h1>4</h1>
            <h3>Usuarios</h3>
          </li>
          <p><i class="arrow right"></i></p>
          <li>
            <h1 class="">5</h1>
            <h3>Vinculos</h3>
          </li>
        </ul>
        <CsvUploader :processoID="processoID" :disciplinaCodigo="disciplinaCodigo" categoria="turma" />
      </div>
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
  data() {
    return {
      processoID: this.$route.params.processoId,
      disciplinaCodigo: this.$route.params.disciplinaCodigo,
    };
  },
  methods: {
    goUsuarios() {
      this.$router.push('/usuarios');
    }
  }
}
</script>
