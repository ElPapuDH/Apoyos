<template>
    <div class="visual-tab">
      <h2 class="title">Registros de Apoyos</h2>
      <div v-if="loading" class="loading">Cargando registros...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div class="filters">
          <input
            v-model="searchTerm"
            placeholder="Buscar por nombre o tipo de apoyo"
            class="search-input"
          />
          <select v-model="sortBy" @change="sortRegistros" class="sort-select">
            <option value="Registro">Ordenar por Registro</option>
            <option value="Fecha">Ordenar por Fecha</option>
            <option value="Nombre">Ordenar por Nombre</option>
            <option value="Tipo_Apoyo">Ordenar por Tipo de Apoyo</option>
            <option value="Monto_Autorizado">Ordenar por Monto Autorizado</option>
          </select>
          <select v-model="selectedSection" class="sort-select">
            <option value="">Filtrar por Sección</option>
            <option v-for="seccion in uniqueSections" :key="seccion" :value="seccion">{{ seccion }}</option>
          </select>
          <select v-model="selectedStatus" class="sort-select">
            <option value="">Filtrar por Estado</option>
            <option value="En proceso">En Proceso</option>
            <option value="Autorizado">Aprobado</option>
            <option value="Rechazado">Rechazado</option>
          </select>
        </div>
        <div class="button-group">
          <button @click="irAPerfil" class="profile-btn">Ir a Perfil</button>
        </div>
  
        <div class="table-responsive table-container">
  <table class="table table-hover table-bordered table-striped">
    <thead class="table-primary">
      <tr>
        <th>Registro</th>
        <th>Fecha</th>
        <th>ID Usuario</th>
        <th>Nombre</th>
        <th>Domicilio</th>
        <th>Colonia/Comunidad</th>
        <th>Sección</th>
        <th>Contacto</th>
        <th>Tipo de Apoyo</th>
        <th>Descripción del Apoyo</th>
        <th>Status</th>
        <th>Monto Autorizado</th>
        <th>Otro Tipo de Ayuda</th>
        <th>Turnado A</th>
        <th>Historial</th>
        <th>Nube</th>
        <th>Creación de Registro</th>
        <th>Actualización de Registro</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="registro in filteredRegistros" :key="registro.Registro">
        <td>{{ registro.Registro }}</td>
        <td>{{ formatDate(registro.Fecha) }}</td>
        <td>{{ registro.id_usuario }}</td>
        <td>{{ registro.Nombre }}</td>
        <td>{{ registro.Domicilio_Calle }}</td>
        <td>{{ registro.Colonia_Comunidad }}</td>
        <td>{{ registro.Seccion }}</td>
        <td>{{ registro.Contacto }}</td>
        <td>{{ registro.TipoDeApoyo }}</td>
        <td>{{ registro.Descripcion_Apoyo }}</td>
        <td :class="{'text-primary': registro.Status === 'En proceso','text-success': registro.Status === 'Autorizado', 'text-danger': registro.Status === 'Rechazado'}">
          {{ registro.Status }}
        </td>
        <td>{{ formatCurrency(registro.Monto_Autorizado) }}</td>
        <td>{{ registro.Otro_Tipo_De_Ayuda }}</td>
        <td>{{ registro.Turnado_A }}</td>
        <td>{{ registro.Historial }}</td>
        <td>
          <a v-if="registro.Nube" :href="registro.Nube" target="_blank" class="btn btn-link">Ver documento</a>
          <span v-else>No disponible</span>
        </td>
        <td>{{ formatDate(registro.creacion_de_registro) }}</td>
        <td>{{ formatDate(registro.actualizacion_de_registro) }}</td>
        <td>
          <button @click="iniciarEdicion(registro)" class="btn btn-sm btn-outline-success  me-1">Editar</button>
          <button @click="confirmarEliminacion(registro.Registro)" class="btn btn-sm btn-outline-danger">Eliminar</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>

  
        <!-- Formulario de Edición -->
        <div v-if="isEditing" class="edit-form" ref="editSection">
  <h3 class="edit-title">Editar Registro</h3>
  <div class="mb-3">
    <label for="editNombre" class="form-label">Nombre</label>
    <input id="editNombre" v-model="editRegistro.Nombre" placeholder="Nombre" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editDomicilio" class="form-label">Domicilio</label>
    <input id="editDomicilio" v-model="editRegistro.Domicilio_Calle" placeholder="Domicilio" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editColonia" class="form-label">Colonia/Comunidad</label>
    <input id="editColonia" v-model="editRegistro.Colonia_Comunidad" placeholder="Colonia/Comunidad" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editSeccion" class="form-label">Sección</label>
    <input id="editSeccion" v-model.number="editRegistro.Seccion" placeholder="Sección" type="number" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editContacto" class="form-label">Contacto</label>
    <input id="editContacto" v-model="editRegistro.Contacto" placeholder="Contacto" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editTipoApoyo" class="form-label">Tipo de Apoyo</label>
    <input id="editTipoApoyo" v-model="editRegistro.TipoDeApoyo" placeholder="Tipo de Apoyo" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editDescripcionApoyo" class="form-label">Descripción del Apoyo</label>
    <input id="editDescripcionApoyo" v-model="editRegistro.Descripcion_Apoyo" placeholder="Descripción del Apoyo" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editMontoAutorizado" class="form-label">Monto Autorizado</label>
    <input id="editMontoAutorizado" v-model.number="editRegistro.Monto_Autorizado" placeholder="Monto Autorizado" type="number" class="form-control" />
  </div>
  <div class="mb-3">
    <label for="editOtroTipoAyuda" class="form-label">Otro Tipo de Ayuda</label>
    <input id="editOtroTipoAyuda" v-model="editRegistro.Otro_Tipo_De_Ayuda" placeholder="Otro Tipo de Ayuda" class="form-control" />
  </div>

  <div class="mb-3">
    <label for="editStatus" class="form-label">Estado</label>
    <select id="editStatus" v-model="editRegistro.Status" class="form-select" @change="updateStatusIndicator">
      <option value="Autorizado">Autorizado</option>
      <option value="Rechazado">Rechazado</option>
    </select>
  </div>

  <div class="status-indicator mb-3" :class="{'authorized': editRegistro.Status === 'Autorizado', 'rejected': editRegistro.Status === 'Rechazado'}">
    {{ statusMessage }}
  </div>

  <div class="button-group">
    <button @click="actualizarRegistro" class="btn btn-success me-2">Guardar Cambios</button>
    <button @click="cancelarEdicion" class="btn btn-secondary">Cancelar</button>
  </div>
</div>

      </div>
    </div>
  </template>
  
  
  <script setup>
 import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// Estado del componente
const registros = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const sortBy = ref('Registro');
const isEditing = ref(false);
const editRegistro = ref({});
const statusMessage = ref('');
const selectedSection = ref('');
const selectedStatus = ref('');
const uniqueSections = ref([]); // Para almacenar secciones únicas

// Funciones de formato
const formatDate = (date) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('es-MX', options);
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

// Fetch de registros
const fetchRegistros = async () => {
  try {
    const response = await axios.get('http://localhost:3030/api/registros');
    registros.value = response.data;
    loading.value = false;

    // Obtener secciones únicas
    uniqueSections.value = [...new Set(response.data.map(registro => registro.Seccion))];
  } catch (err) {
    error.value = 'Error al cargar los registros. Por favor, intente nuevamente.';
    loading.value = false;
    console.error('Error fetching registros:', err);
  }
};

onMounted(fetchRegistros);

// Filtrado de registros
const filteredRegistros = computed(() => {
  let filtered = registros.value;

  // Filtrar por nombre o tipo de apoyo
  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    filtered = filtered.filter(registro => 
      registro.Nombre.toLowerCase().includes(searchLower) ||
      registro.TipoDeApoyo.toLowerCase().includes(searchLower)
    );
  }

  // Filtrar por sección
  if (selectedSection.value) {
    filtered = filtered.filter(registro => registro.Seccion === selectedSection.value);
  }

  // Filtrar por estado
  if (selectedStatus.value) {
    filtered = filtered.filter(registro => registro.Status === selectedStatus.value);
  }

  // Ordenar registros
  return filtered.sort((a, b) => {
    if (sortBy.value === 'Monto_Autorizado') {
      return a[sortBy.value] - b[sortBy.value];
    }
    if (sortBy.value === 'Registro') {
      return Number(a.Registro) - Number(b.Registro);
    }
    if (a[sortBy.value] < b[sortBy.value]) return -1;
    if (a[sortBy.value] > b[sortBy.value]) return 1;
    return 0;
  });
});
  

  // Iniciar la edición de un registro
  const iniciarEdicion = (registro) => {
    isEditing.value = true;
    editRegistro.value = { ...registro }; 
    statusMessage.value = ''; 
  };
  
  // Cancelar la edición
  const cancelarEdicion = () => {
    isEditing.value = false;
    editRegistro.value = {};
  };
  
  // Actualizar un registro
  const actualizarRegistro = async () => {
    try {
      await axios.put(`http://localhost:3030/api/registros/${editRegistro.value.Registro}`, editRegistro.value);
      await fetchRegistros(); // Refrescar registros después de la edición
      cancelarEdicion(); // Cerrar el formulario de edición
    } catch (err) {
      error.value = 'Error al actualizar el registro.';
      console.error('Error updating registro:', err);
    }
  };
  
  // Confirmar la eliminación de un registro
  const confirmarEliminacion = (registroId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      eliminarRegistro(registroId);
    }
  };
  
  // Eliminar un registro
  const eliminarRegistro = async (registroId) => {
    try {
      await axios.delete(`http://localhost:3030/api/registros/${registroId}`);
      await fetchRegistros(); // Refrescar registros después de la eliminación
    } catch (err) {
      error.value = 'Error al eliminar el registro.';
      console.error('Error deleting registro:', err);
    }
  };
  
  // Actualizar el indicador de estado
  const updateStatusIndicator = () => {
    statusMessage.value = editRegistro.value.Status === 'Autorizado' ? 'Registro autorizado' : 'Registro rechazado';
  };
  import { useRouter } from 'vue-router'; // Importar el router

const router = useRouter(); // Inicializar el router

const irAPerfil = () => {
  router.push({ name: 'Perfil' }); // Redirigir a la ruta 'Perfil'
};

  
  // Inicializar
  onMounted(fetchRegistros);
  </script>
  
  <style scoped>
  .visual-tab {
    padding: 20px;
  }
  .loading {
    font-size: 18px;
    color: #888;
  }
  .error {
    color: red;
  }
  .title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  .filters {
    margin-bottom: 20px;
  }
  .search-input,
  .sort-select,
  .edit-input {
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .table-container {
    overflow-x: auto;
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
  }
  .data-table th,
  .data-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  .button-group {
    display: flex;
    gap: 10px;
  }
  .edit-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  .delete-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  .edit-form {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f9f9f9;
  }
  .status-indicator {
    margin-top: 10px;
    font-weight: bold;
  }
  .status-indicator.authorized {
    color: green;
  }
  .status-indicator.rejected {
    color: red;
  }
  .profile-btn {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.profile-btn:hover {
  background-color: #0056b3;
}

  </style>
  