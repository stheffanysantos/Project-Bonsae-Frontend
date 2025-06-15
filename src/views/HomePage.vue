<template>
  <div class="bodyScreen">
    <div class="containerHome home-center">
      <div class="home-logo">
        <img src="/logobonsae.png" alt="Logo Bonsae" class="logo" />
      </div>
      <h1>
        Bem-vindo ao ambiente de Importação CSV<br />
      </h1>
      <p class="home-description">
        Importe, visualize e gerencie seus arquivos CSV de forma simples e rápida.
      </p>
      <button @click="goProcessos" class="btn-principal btn-entrar">Entrar</button>
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

<style scoped>
.home-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 420px;
  gap: 24px;
}

.home-logo {
  margin-bottom: 12px;
}

.logo {
  height: 80px;
  margin-bottom: 8px;
}

.home-description {
  color: var(--cinza-medio);
  font-size: 1.1rem;
  text-align: center;
  margin-bottom: 16px;
}

.btn-entrar {
  width: 180px;
  font-size: 1.1rem;
  margin-top: 12px;
}
</style>