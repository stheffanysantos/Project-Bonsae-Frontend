<template>
  <div class="containerUploader">
    <h1>Periodo Letivo</h1>
    <div class="content">
      <ul class="passos">
        <li>
          <h1 class="concluido">1</h1>
          <h3>Periodo letivo</h3>
        </li>
        <p><i class="arrow right"></i></p>
        <li>
          <h1>2</h1>
          <h3>Diciplina</h3>
        </li>
        <p><i class="arrow right"></i></p>
        <li>
          <h1>3</h1>
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
      <Form />
    </div>
    <button class="botaoNext" @click="goDiciplinas">Proximo</button>
  </div>
</template>

<script>
import Form from '@/components/Form.vue';
export default {
  name: 'App',
  components: {
    Form,
  },
  methods: {
    goDiciplinas() {
      this.$router.push('/Disciplinas');
    }
  }
}
</script>
