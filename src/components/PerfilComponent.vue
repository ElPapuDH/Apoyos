<template>
  <div class="container my-4 p-4 bg-light rounded shadow">
    <h2 class="text-center text-primary mb-4">Perfil del Usuario</h2>
    <div class="mb-3">
      <div class="d-flex justify-content-between border-bottom pb-2">
        <strong>Nombre:</strong>
        <span>{{ user.nombre }}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <strong>Código de Acceso:</strong>
        <span>{{ user.codigo_acceso }}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <strong>Rol:</strong>
        <span>{{ user.rol }}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <strong>Teléfono:</strong>
        <span>{{ user.telefono }}</span>
      </div>
      <div class="d-flex justify-content-between border-bottom py-2">
        <strong>Id Usuario:</strong>
        <span>{{ user.id_usuario }}</span>
      </div>
    </div>

    <div class="mt-4 d-flex flex-wrap justify-content-between">
      <button @click="logout" class="btn btn-danger mb-2">
        Cerrar Sesión
      </button>
      <button @click="goToregistrof" class="btn btn-primary mb-2">
        Registrar Apoyos
      </button>
      <button v-if="user.rol === 'Auxiliar Administrativo'" @click="goToAdminRegister" class="btn btn-primary mb-2">
        Registrar Usuario
      </button>
      <button v-if="user.rol === 'Auxiliar Administrativo'" @click="goToVisualManager" class="btn btn-primary mb-2">
        Gestión
      </button>
      <button v-if="user.rol === 'Auxiliar Administrativo'" @click="goToAdminUsuarios" class="btn btn-primary mb-2">
        Ver Usuarios Registrados
      </button>
      <button v-if="user.rol === 'Directora'" @click="goToVisual" class="btn btn-primary mb-2">
        Ver Registros de Apoyos
      </button>
      <button v-if="user.rol === 'Directora'" @click="goToGrafica" class="btn btn-primary mb-2">
        Ver Gráficas
      </button>
      <button v-if="user.rol === 'Directora'" @click="goToTablaUsuarios" class="btn btn-primary mb-2">
        Ver Usuarios Registrados
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const user = ref({});
const router = useRouter();
const storedUser = localStorage.getItem('user');

if (storedUser) {
  user.value = JSON.parse(storedUser);
}

const logout = () => {
  localStorage.removeItem('user');
  router.push('/login'); 
};

const goToregistrof = () => {
  router.push('/registrof'); // Eliminar la línea que borra el localStorage
};

const goToAdminRegister = () => {
  router.push('/registro'); 
};

const goToVisualManager = () => {
  router.push('/visualAdmin');
};

const goToAdminUsuarios = () => {
  router.push('/adminUs'); 
};

const goToGrafica = () => {
  router.push('/grafica');
};

const goToVisual = () => {
  router.push('/visual');
};

const goToTablaUsuarios = () => {
  router.push('/tablaUs');
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.bg-white {
  background-color: #ffffff;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.table-responsive {
  max-height: 400px;
  overflow-y: auto;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #87a8d3;
  border-radius: 0.375rem;
  margin-top: 1rem;
}
</style>
