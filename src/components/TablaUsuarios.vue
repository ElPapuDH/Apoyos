<template>
  <div>
    <h2>Usuarios Registrados</h2>

    <div class="search-container">
      <label for="searchName">Buscar por Nombre:</label>
      <input type="text" v-model="filtroNombre" id="searchName" placeholder="Escribe el nombre del usuario" />
    </div>

    <div class="filtro-container">
      <label for="rolFilter">Filtrar por Rol:</label>
      <select v-model="filtroRol" id="rolFilter">
        <option value="">Todos</option>
        <option value="gerente">Gerentes</option>
        <option value="admin">Administradores</option>
        <option value="normal">Usuarios Normales</option>
      </select>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Código de acceso</th>
          <th>Creado en</th>
          <th>Actualizado en</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="usuario in usuariosFiltrados" :key="usuario.id">
          <td class="registro">{{ usuario.id }}</td>
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.correo }}</td>
          <td>{{ usuario.rol }}</td>
          <td>{{ usuario.codigo_acceso }}</td>
          <td>{{ usuario.creado_en }}</td>
          <td>{{ usuario.actualizado_en }}</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-between mb-4">
      <button @click="goToPerfil" class="button-perfil">
        Volver al Perfil
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'TablaUsuarios',
  data() {
    return {
      usuarios: [],
      filtroRol: '',
      filtroNombre: '',
    };
  },
  computed: {
    usuariosFiltrados() {
      let filtrados = this.usuarios;

      if (this.filtroRol) {
        filtrados = filtrados.filter(usuario => usuario.rol === this.filtroRol);
      }

      if (this.filtroNombre) {
        filtrados = filtrados.filter(usuario =>
          usuario.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
        );
      }

      return filtrados;
    },
  },
  mounted() {
    this.obtenerUsuarios();
  },
  methods: {
    async obtenerUsuarios() {
      try {
        const response = await axios.get('http://localhost:3030/api/registro_usuarios');
        console.log('Datos recibidos:', response.data);
        this.usuarios = response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    },
    // Función para volver al perfil
    goToPerfil() {
      this.$router.push('/perfil');
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #0056b3; 
  color: white; 
}

.registro {
  background-color: #e0f7fa;
}

td {
  background-color: #ffffff; 
  color: #333333; 
}


.filtro-container,
.search-container {
  margin-bottom: 10px;
}

label {
  margin-right: 10px;
}

input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button-container {
  margin-top: 20px;
}

.button-perfil {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.button-perfil:hover {
  background-color: #45a049;
}
</style>
