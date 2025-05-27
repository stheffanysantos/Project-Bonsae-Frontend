<template>
  <div class="wallpaper-container">
    <!-- Ondas animadas (verticalmente) -->
    <svg class="waves" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path class="wave wave1" d="M0,160 C480,240 960,80 1440,160 L1440,320 L0,320 Z" />
      <path class="wave wave2" d="M0,180 C480,260 960,100 1440,180 L1440,320 L0,320 Z" />
    </svg>

    <!-- Conteúdo -->
    <div class="content">
      <slot></slot>
    </div>

    <!-- Logo no canto superior direito -->
    <img src="../assets/img/logo.jpg" class="logo" alt="Logo Bonsae" />
  </div>
</template>

<style scoped>
.wallpaper-container {
  background: white;
  overflow: scroll;
}

.logo {
  position: absolute;
  top: 1rem;
  right: 1rem;
  height: 50px;
  z-index: 10;
}

.content {
  position: relative;
  z-index: 5;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

/* Ondas */
.waves {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 30%;
  z-index: 1;
}

.wave {
  fill: #1677ff;
  opacity: 0.7;
  animation: waveFloat 6s ease-in-out infinite;
}

.wave2 {
  fill: #1677ff;
  opacity: 0.4;
  animation-delay: -3s;
}

/* Movimento suave vertical */
@keyframes waveFloat {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}
</style>
