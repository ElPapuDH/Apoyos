<template>
  <div class="visual-tab">
    <h2>Registros de Apoyos</h2>
    <div v-if="loading" class="loading">Cargando registros...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else>
      <div class="filters">
        <input v-model="searchTerm" placeholder="Buscar por nombre o tipo de apoyo" @input="filterRegistros"
          class="search-input" />
        <select v-model="selectedSeccion" @change="filterRegistros" class="sort-select">
          <option value="">Filtrar por Sección</option>
          <option v-for="seccion in secciones" :key="seccion" :value="seccion">{{ seccion }}</option>
        </select>
        <select v-model="selectedStatus" @change="filterRegistros" class="sort-select">
          <option value="">Filtrar por Estado</option>
          <option value="Autorizado">Aprobados</option>
          <option value="Rechazado">Rechazados</option>
          <option value="En Proceso">En Proceso</option>
        </select>
        <select v-model="sortBy" @change="sortRegistros" class="sort-select">
          <option value="Registro">Ordenar por Registro</option>
          <option value="Tipo_Apoyo">Ordenar por Tipo de Apoyo</option>
          <option value="Monto_Autorizado">Ordenar por Monto Autorizado</option>
        </select>
        <div class="button-container">
          <button @click="goToPerfil" class="perfil-btn">Ir al Perfil</button>
        </div>
      </div>

      <div class="table-container">
        <table>
          <thead>
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
              <th>Observaciones</th>
              <th>Creación de Registro</th>
              <th>Actualización de Registro</th>
              <th>Creado por</th>
              <th>Actualizado por</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="registro in filteredRegistros" :key="registro.Registro" class="registro">
              <td class="registro">{{ registro.Registro }}</td>
              <td>{{ formatDate(registro.Fecha) }}</td>
              <td>{{ registro.id_usuario }}</td>
              <td>{{ registro.Nombre }}</td>
              <td>{{ registro.Domicilio_Calle }}</td>
              <td>{{ registro.Colonia_Comunidad }}</td>
              <td>{{ registro.Seccion }}</td>
              <td>{{ registro.Contacto }}</td>
              <td>{{ registro.TipoDeApoyo }}</td>
              <td>{{ registro.Descripcion_Apoyo }}</td>
              <td
                :class="{ 'text-primary': registro.Status === 'En proceso', 'text-success': registro.Status === 'Autorizado', 'text-danger': registro.Status === 'Rechazado' }">
                {{ registro.Status }}
              </td>
              <td>{{ formatCurrency(registro.Monto_Autorizado) }}</td>
              <td>{{ registro.Otro_Tipo_De_Ayuda }}</td>
              <td>{{ registro.Turnado_A }}</td>
              <td>{{ registro.Historial }}</td>
              <td>
                <a v-if="registro.Nube" :href="registro.Nube" target="_blank">Ver documento</a>
                <span v-else>No disponible</span>
              </td>
              <td>{{ registro.Observaciones }}</td>
              <td>{{ formatDate(registro.creacion_de_registro) }}</td>
              <td>{{ formatDate(registro.actualizacion_de_registro) }}</td>
              <td>{{ registro.creado_por_nombre }}</td>
              <td>{{ registro.actualizado_por_nombre || 'N/A' }}</td>
              <td>
                <button @click="iniciarEdicion(registro)" class="btn btn-sm btn-outline-success me-1">Editar</button>
                <button @click="confirmarEliminacion(registro.Registro)"
                  class="btn btn-sm btn-outline-danger">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="isEditing" class="edit-form">
        <h3>Editar Registro</h3>
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="editRegistro.Nombre" placeholder="Nombre" class="form-input" />
        </div>
        <div class="form-group">
          <label>Domicilio</label>
          <input v-model="editRegistro.Domicilio_Calle" placeholder="Domicilio" class="form-input" />
        </div>
        <div class="form-group">
          <label>Colonia/Comunidad</label>
          <input v-model="editRegistro.Colonia_Comunidad" placeholder="Colonia/Comunidad" class="form-input" />
        </div>
        <div class="form-group">
          <label>Sección</label>
          <input v-model.number="editRegistro.Seccion" placeholder="Sección" type="number" class="form-input" />
        </div>
        <div class="form-group">
          <label>Contacto</label>
          <input v-model="editRegistro.Contacto" placeholder="Contacto" class="form-input" />
        </div>
        <div class="form-group">
          <label>Tipo de Apoyo</label>
          <input v-model="editRegistro.TipoDeApoyo" placeholder="Tipo de Apoyo" class="form-input" />
        </div>
        <div class="form-group">
          <label>Descripción del Apoyo</label>
          <input v-model="editRegistro.Descripcion_Apoyo" placeholder="Descripción del Apoyo" class="form-input" />
        </div>
        <div class="form-group">
          <label>Monto Autorizado</label>
          <input v-model.number="editRegistro.Monto_Autorizado" placeholder="Monto Autorizado" type="number"
            class="form-input" />
        </div>
        <div class="form-group">
          <label>Otro Tipo de Ayuda</label>
          <input v-model="editRegistro.Otro_Tipo_De_Ayuda" placeholder="Otro Tipo de Ayuda" class="form-input" />
        </div>
        <div class="form-group">
          <label>Observaciones</label>
          <input v-model="editRegistro.Observaciones" placeholder="Observaciones" class="form-input" />
        </div>
        <div class="form-group">
          <label>Estado</label>
          <select v-model="editRegistro.Status" class="form-select">
            <option value="Autorizado">Autorizado</option>
            <option value="Rechazado">Rechazado</option>
            <option value="En Proceso">En Proceso</option>
          </select>
        </div>
        <div class="button-group">
          <button @click="actualizarRegistro" class="edit-btn">Guardar Cambios</button>
          <button @click="cancelarEdicion" class="cancel-btn">Cancelar</button>
        </div>
      </div>

      <div class="totales">
        <h3>Total Gastado por Mes y Sección</h3>
        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Sección</th>
              <th>Total Gastado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(total, index) in totalPorMesYSeccion" :key="index">
              <td>{{ total.mes }}</td>
              <td>{{ total.seccion }}</td>
              <td>{{ formatCurrency(total.monto) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const registros = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const selectedSeccion = ref('');
const selectedStatus = ref('');
const sortBy = ref('Registro');
const isEditing = ref(false);
const editRegistro = ref({});
const secciones = ref([]);
const router = useRouter();
const user = ref(null);

const formatDate = (date) => {
  if (!date) return 'N/A';
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return new Date(date).toLocaleDateString('es-MX', options);
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

const filteredRegistros = computed(() => {
  let results = registros.value;

  if (searchTerm.value) {
    const searchLower = searchTerm.value.toLowerCase();
    results = results.filter((registro) =>
      registro.Nombre.toLowerCase().includes(searchLower) ||
      registro.TipoDeApoyo.toLowerCase().includes(searchLower)
    );
  }

  if (selectedSeccion.value) {
    results = results.filter((registro) => registro.Seccion === selectedSeccion.value);
  }

  if (selectedStatus.value) {
    results = results.filter((registro) => registro.Status === selectedStatus.value);
  }

  return results.sort((a, b) => {
    if (sortBy.value === 'Registro') return a.Registro - b.Registro;
    if (sortBy.value === 'Tipo_Apoyo') return a.TipoDeApoyo.localeCompare(b.TipoDeApoyo);
    if (sortBy.value === 'Monto_Autorizado') return a.Monto_Autorizado - b.Monto_Autorizado;
    return 0;
  });
});

const totalPorMesYSeccion = computed(() => {
  const totals = {};
  registros.value.forEach((registro) => {
    if (!registro.Fecha || !registro.Monto_Autorizado) return;
    const mes = formatDate(registro.Fecha).split('/')[1];
    const seccion = registro.Seccion;
    const monto = registro.Monto_Autorizado;

    if (!totals[mes]) totals[mes] = {};
    if (!totals[mes][seccion]) totals[mes][seccion] = 0;
    totals[mes][seccion] += monto;
  });

  return Object.entries(totals).flatMap(([mes, secciones]) =>
    Object.entries(secciones).map(([seccion, monto]) => ({ mes, seccion, monto }))
  );
});

onMounted(async () => {
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user.value = JSON.parse(storedUser);
    } else {
      throw new Error('No se encontró un usuario con sesión iniciada');
    }

    const response = await axios.get('http://localhost:3030/api/registros');
    registros.value = response.data;
    const seccionesSet = new Set(registros.value.map((registro) => registro.Seccion));
    secciones.value = Array.from(seccionesSet);
  } catch (err) {
    console.error('Error al cargar los registros:', err);
    error.value = 'Error al cargar los registros: ' + (err.response?.data?.message || err.message);
  } finally {
    loading.value = false;
  }
});

const actualizarRegistro = async () => {
  const nombreUsuario = localStorage.getItem('nombreUsuario');
  this.editRegistro.actualizado_por_nombre = nombreUsuario;

  try {

    await this.$http.put(`/api/registros/${this.editRegistro.Registro}`, this.editRegistro);
    this.fetchRegistros();
    this.cancelarEdicion();
  } catch (error) {
    this.error = 'Error al actualizar el registro';
  }
}



const cancelarEdicion = () => {
  isEditing.value = false;
  editRegistro.value = {};
  error.value = null;
};

const iniciarEdicion = (registro) => {
  isEditing.value = true;
  editRegistro.value = { ...registro };
  error.value = null;
};

const confirmarEliminacion = (registroId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este registro?')) {
    eliminarRegistro(registroId);
  }
};

const eliminarRegistro = async (registroId) => {
  try {

    await axios.delete(`http://localhost:3030/api/registros/${registroId}`);
    registros.value = registros.value.filter(registro => registro.Registro !== registroId);
    error.value = null;
  } catch (err) {
    console.error('Error al eliminar el registro:', err);
    error.value = 'Error al eliminar el registro: ' + (err.response?.data?.message || err.message);
  }
};

const goToPerfil = () => {
  router.push('/perfil');
};
</script>

<style scoped>
.visual-tab {
  padding: 20px;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.loading,
.error {
  text-align: center;
  font-size: 1.2em;
  margin: 20px 0;
}

.error {
  color: red;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input,
.sort-select {
  margin: 5px;
  padding: 5px;
}

.search-input {
  flex-grow: 1;
}

.button-container {
  display: flex;
  align-items: center;
}

.perfil-btn {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.perfil-btn:hover {
  background-color: #0056b3;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

thead {
  background-color: #e0f7fa;
}

th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.text-primary {
  color: #007bff;
}

.text-success {
  color: #28a745;
}

.text-danger {
  color: #dc3545;
}

.edit-form {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 10px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 5px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.edit-btn,
.cancel-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn {
  background-color: #28a745;
  color: white;
}

.cancel-btn {
  background-color: #dc3545;
  color: white;
}

.totales {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>