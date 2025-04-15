<template>
  <div>
    <main>
      <div class="container">
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

        <div class="content-img">
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
      <form class="btns" @submit.prevent="handleLogin">
        <div v-if="errorMessage" class="error" style="text-align: center; color: red;">
          {{ errorMessage }}
        </div>
        <input type="text" placeholder="Usuário" v-model="username" />
        <input type="password" placeholder="Senha" v-model="password" />
        <button type="submit" class="btn-principal">Login</button>
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
      ],
      database: [
        { username: "admin1", password: "pass1" },
        { username: "admin2", password: "pass2" },
        { username: "user1", password: "pass1" },
      ],
    };
  },
  methods: {
    moveToSlide(index) {
      this.currentIndex = index;
    },
    handleLogin() {
      const user = this.database.find(u => u.username === this.username);
      if (user && user.password === this.password) {
        this.errorMessage = "";
        this.$router.push('/Disciplinas');
      } else {
        this.errorMessage = "Usuário ou senha inválidos.";
      }
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');

:root {
  --bg-color: #FFFFFF;
  --cor-secundaria: #656DFF;
  --preto: #1E1E1E;
  --highlight-color: #656DFF;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Almarai", sans-serif;
}

body {
  background-color: var(--cor-secundaria);
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
}

.container-blue {
  position: absolute;
  top: -84px;
  left: -3155px;
  width: 1920px;
  height: 1080px;
  background-color: var(--cor-secundaria);
  z-index: -1;
}

.container {
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: left;
  background-color: var(--bg-color);
  border-bottom-right-radius: 50px;
  border-bottom-left-radius: 50px;
  padding: 50px 0;
  flex-grow: 1;
  margin-bottom: 100px;
}

.content-img img {
  max-width: 100%;
  height: auto;
}

.content-text {
  padding-top: 200px;
  font-size: 24px;
  font-weight: 700;
  max-width: 500px;
  display: flex;
  flex-direction: column;
}

.content-text p {
  font-weight: 300;
  font-size: 15px;
  color: #747474;
  padding-bottom: 15px;
}

.carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.carousel-item {
  display: none;
  width: 100%;
  height: auto;
  text-align: center;
}

.carousel-item.active {
  display: block;
}

.carousel-indicators {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  text-align: left;
  margin-left: 30px;
}

.dot {
  width: 12px;
  height: 12px;
  background-color: #ccc;
  border-radius: 50%;
  display: inline-block;
  transition: background-color 0.3s;
  cursor: pointer;
}

.dot.active {
  background-color: #000;
}

.highlight {
  color: var(--highlight-color);
}

.content-text h1 {
  white-space: nowrap;
}

footer {
  background-color: var(--cor-secundaria);
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}

.btns {
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.btns input {
  text-align: center;
  background-color: var(--bg-color);
  color: rgb(0, 0, 0);
  text-decoration: none;
  width: 331px;
  height: 63px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  transition: background-color 0.3s ease;
  border: none;
  margin-bottom: 15px;
}

.btn-principal {
  background-color: var(--preto);
  color: white;
  text-decoration: none;
  width: 331px;
  height: 63px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  transition: background-color 0.3s ease;
  border: none;
}

.btn-principal:hover {
  background-color: #333333;
}
</style>
