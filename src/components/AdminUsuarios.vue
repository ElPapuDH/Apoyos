<template>
  <div class="container mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Administrar Usuarios Normales</h2>
    <div class="mb-4 d-flex justify-content-between">
      <button @click="goToPerfil" class="btn btn-primary">
        Volver al Perfil
      </button>
    </div>

    <div v-if="loading" class="text-center">Cargando usuarios...</div>
    <div v-else-if="error" class="text-danger">{{ error }}</div>
    <div v-else>
      <div class="table-responsive">
        <table class="table table-striped table-bordered">
          <thead class="bg-light">
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Código de Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id_usuario">
              <td>{{ usuario.nombre }}</td>
              <td>{{ usuario.correo }}</td>
              <td>{{ usuario.codigo_acceso }}</td>
              <td class="d-flex gap-2">
                <button @click="editarUsuario(usuario)" class="btn btn-success btn-sm">
                  <i class="bi bi-pencil"></i> Editar
                </button>
                <button @click="eliminarUsuario(usuario.id_usuario)" class="btn btn-danger btn-sm">
                  <i class="bi bi-trash"></i> Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="usuarioSeleccionado" class="mt-10">
        <h3 class="text-xl font-bold mb-4">Editar Usuario</h3>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td>Nombre:</td>
              <td>
                <input v-model="usuarioSeleccionado.nombre" class="form-control" />
              </td>
            </tr>
            <tr>
              <td>Correo:</td>
              <td>
                <input v-model="usuarioSeleccionado.correo" class="form-control" />
              </td>
            </tr>
            <tr>
              <td>Código de Acceso:</td>
              <td>
                <input v-model="usuarioSeleccionado.codigo_acceso" class="form-control" />
              </td>
            </tr>
          </tbody>
        </table>
        <button @click="guardarCambios" class="btn btn-success mt-4">
          Guardar Cambios
        </button>
        <button @click="cancelarEdicion" class="btn btn-secondary mt-4">
          Cancelar Edición
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const usuarios = ref([]);
const loading = ref(true);
const error = ref(null);
const usuarioSeleccionado = ref(null);

const fetchUsuarios = async () => {
  try {
    const response = await axios.get('http://localhost:3030/api/registro_usuarios');
    usuarios.value = response.data.filter(usuario => usuario.rol === 'normal');
    loading.value = false;
  } catch (err) {
    error.value = 'Error al cargar usuarios.';
    console.error(err);
    loading.value = false;
  }
};

onMounted(fetchUsuarios);

const editarUsuario = (usuario) => {
  usuarioSeleccionado.value = { ...usuario };
};

const guardarCambios = async () => {
  try {
    const response = await axios.put(`http://localhost:3030/api/registro_usuarios/${usuarioSeleccionado.value.id_usuario}`, usuarioSeleccionado.value);

    if (response.status === 200) {
      const index = usuarios.value.findIndex(u => u.id_usuario === usuarioSeleccionado.value.id_usuario);
      if (index !== -1) {
        usuarios.value[index] = { ...usuarioSeleccionado.value };
      }
      usuarioSeleccionado.value = null;
    }
  } catch (err) {
    console.error('Error al guardar cambios:', err);
  }
};

const cancelarEdicion = () => {
  usuarioSeleccionado.value = null;
};

const eliminarUsuario = async (idUsuario) => {
  try {
    await axios.delete(`http://localhost:3030/api/registro_usuarios/${idUsuario}`);
    await axios.delete(`http://localhost:3030/api/registros/${idUsuario}`);
    await fetchUsuarios();
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
  }
};

const goToPerfil = () => {
  router.push('/perfil');
};
</script>

<style scoped>
.container {
  max-width: 800px;
}

.table {
  width: 100%;
}

.table-bordered {
  border: 1px solid #686868;
}

.table-bordered th,
.table-bordered td {
  border: 1px solid #686868;
}
</style>
