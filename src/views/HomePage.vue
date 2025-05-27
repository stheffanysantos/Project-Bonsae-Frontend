<template>
  <div class="bodyScreen">
    <div class="containerHome">
      <div>
        <h1>
          Bem Vindo ao ambiente de <br />
          <span class="gradient-text">importação CSV</span>
        </h1>
      </div>
      <button @click="goProcessos" class="btn-principal">Entrar</button>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    goProcessos() {
      this.$router.push('/processos');
    },
  },
};
</script>
