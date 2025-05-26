<template>
  <div>
    <main>
      <div class="containerHome">
        <div class="content-text">
          <h1>
            Bem Vindo ao ambiente de <br />
            <span class="highlight">importação CSV</span> !
          </h1>
          <p>
            A space that unites conscious individuals who <br />
            collaborate to reduce their carbon footprint.
          </p>

          <!-- Indicadores do carrossel (bolinhas) -->
          <div class="carousel-indicators">
            <span v-for="(dot, index) in slides.length" :key="index" class="dot"
              :class="{ active: currentIndex === index }" @click="moveToSlide(index)"></span>
          </div>
        </div>

        <div class="contentImgHome">
          <!-- Carrossel de Imagens -->
          <div class="carousel">
            <div v-for="(slide, index) in slides" :key="index" class="carousel-item"
              :class="{ active: currentIndex === index }">
              <img :src="slide.src" :alt="slide.alt" />
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
      currentIndex: 0,
      username: "",
      password: "",
      errorMessage: "",
      slides: [
        {
          src: 'https://via.placeholder.com/800x400/00FF00/FFFFFF?text=Imagem+2',
          alt: 'Imagem 1',
        },
        {
          src: 'https://via.placeholder.com/800x400/00FF00/FFFFFF?text=Imagem+2',
          alt: 'Imagem 2',
        },
        {
          src: 'https://via.placeholder.com/800x400/0000FF/FFFFFF?text=Imagem+3',
          alt: 'Imagem 3',
        },
        {
          src: 'https://via.placeholder.com/800x400/FFFF00/FFFFFF?text=Imagem+4',
          alt: 'Imagem 4',
        },
      ]
    };
  },
  methods: {
    moveToSlide(index) {
      this.currentIndex = index;
    },
    goProcessos() {
      this.$router.push('/processos');
    },
  },
};
</script>
