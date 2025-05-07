<template>
    <main class="home-wrapper">
      <div class="containerHome">
        <div class="containerHome-Text">
          <div class="content-text">
            <h1 class="text-title">
              Bem Vindo ao ambiente de <br />
              <span class="highlight">importação CSV</span> !
            </h1>
            <p class="text-subtitle">
              A space that unites conscious individuals who <br />
              collaborate to reduce their carbon footprint.
            </p>
          </div>
          <div class="content-img">
            <img src="" alt="">
          </div>
        </div>

      <div class="form-component">
        <form class="btnsHome" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="error" style="text-align: center; color: red;">
            {{ errorMessage }}
          </div>
          <input type="text" placeholder="Usuário" v-model="username" />
          <input type="password" placeholder="Senha" v-model="password" />
          <button type="submit" class="btn-principal">Login</button>
        </form>
      </div>
   </div>
  </main>
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
        this.$router.push('/periodo');
      } else {
        this.errorMessage = "Usuário ou senha inválidos.";
      }
    },
  },
};
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap');

.home-wrapper {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #f0f4ff, #ffffff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.containerHome {
  display: flex;
  flex-wrap: wrap;
  max-width: 1100px;
  background-color: #fff;
  border-radius: 32px;
  box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.containerHome-Text {
  flex: 1;
  min-width: 300px;
  padding: 60px;
  background: var(--bg-color);
}

.content-text {
  font-size: 24px;
  font-weight: 700;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  margin: 0;
}

.content-text h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.text-subtitle {
  font-size: 1rem;
  font-weight: 300;
  color: #747474;
}

.content-img img {
  width: 100%;
  max-width: 400px;
  height: auto;
}

.form-component {
  flex: 1;
  min-width: 300px;
  padding: 60px;
  background-color: #f8f9ff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.btnsHome {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btnsHome input {
  width: 100%;
  height: 50px;
  border-radius: 12px;
  border: 1px solid #dcdcdc;
  padding: 0 15px;
  margin-bottom: 20px;
  font-size: 1rem;
  transition: border 0.3s;
}

.btnsHome input:focus {
  border-color: var(--cor-secundaria);
  outline: none;
}

.btn-principal {
  width: 100%;
  height: 50px;
  background-color: #4d56d1;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-principal:hover {
  background-color: #656bc4;
}

.error {
  background-color: #ffdddd;
  border: 1px solid red;
  color: red;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  width: 100%;
  text-align: center;
  font-size: 0.9rem;
}


</style>