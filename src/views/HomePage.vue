<template>
  <div class="fundo-principal">
    <main>
      <div class="containerHome">
        <div class="content-text">
          <h1>
            Bem Vindo ao ambiente de <br />
            <span class="highlight">importação CSV</span> !
          </h1>
          <p>
            Importe seus arquivos CSV de forma rápida, segura e sem complicações. <br />
          </p>

        </div>

        <div class="contentImgHome">
          <div class="carousel">
            <div class="carousel-item">
              <img src="../assets/img/imagemTelaInicial.png" alt="imagem inicial" />
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <form class="btnsHome" @submit.prevent="handleLogin">
        <button @click="goProcessos" class="btn-principal">Entrar</button>
      </form>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    goProcessos() {
      this.$router.push('/processos');
    },
  },
};
</script>
