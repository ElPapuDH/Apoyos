<template>
  <div class="home-container">
    <div class="welcome-content">
      <h1 class="welcome-title">Bienvenidos</h1>
      <p class="welcome-message">Plataforma para solicitar tu apoyo.</p>
      <div class="button-container">
        <button @click="goToLogin" class="nav-button">Ir a Login</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.welcome-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f0f4f8;
}

.welcome-title {
  font-size: 3rem; /* Tamaño de fuente grande */
  color: #2c3e50;
  margin-bottom: 1rem;
}

.welcome-message {
  font-size: 1.2rem;
  color: #34495e;
  text-align: center;
  max-width: 600px; /* Ancho máximo para el mensaje */
}

/* Contenedor del botón */
.button-container {
  margin-top: 20px;
}

/* Estilo del botón */
.nav-button {
  padding: 10px 20px;
  margin: 5px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

/* Hover del botón */
.nav-button:hover {
  background-color: #45a049;
}

/* Media Queries para dispositivos pequeños */
@media (max-width: 768px) {
  .welcome-title {
    font-size: 2.5rem; /* Reduce el tamaño de la fuente en pantallas pequeñas */
  }

  .welcome-message {
    font-size: 1rem; /* Tamaño de fuente más pequeño */
    padding: 0 1rem; /* Espaciado en los lados */
  }

  .nav-button {
    padding: 8px 16px; /* Botón más pequeño */
    font-size: 14px; /* Tamaño de fuente del botón */
  }
}

/* Media Queries para dispositivos extra pequeños */
@media (max-width: 480px) {
  .welcome-title {
    font-size: 2rem; /* Tamaño de fuente aún más pequeño */
  }

  .welcome-message {
    font-size: 0.9rem; /* Tamaño de fuente del mensaje más pequeño */
  }
}
</style>
