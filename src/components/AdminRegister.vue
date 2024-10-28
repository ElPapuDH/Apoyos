<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Registro de Usuarios</h2>
      </div>
      <form @submit.prevent="registerUser" class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="nombre" class="sr-only">Nombre</label>
            <input v-model="newUser.nombre" id="nombre" name="nombre" type="text" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nombre">
            <p v-if="errors.nombre" class="text-red-500 text-xs italic">{{ errors.nombre }}</p>
          </div>
          <div>
            <label for="telefono" class="sr-only">Teléfono</label>
            <input v-model="newUser.telefono" id="telefono" name="telefono" type="tel" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Teléfono">
            <p v-if="errors.telefono" class="text-red-500 text-xs italic">{{ errors.telefono }}</p>
          </div>
          <div>
            <label for="rol" class="sr-only">Rol</label>
            <select v-model="newUser.rol" id="rol" name="rol" required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm">
              <option value="Directora">Directora</option>
              <option value="Auxiliar Administrativo">Auxiliar Administrativo</option>
            </select>
          </div>
        </div>

        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-3 px-6 border border-transparent text-lg font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Registrar Usuario
          </button>
        </div>
      </form>
      <div v-if="registrationCode" class="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
        <p class="text-sm">Usuario registrado exitosamente. Código de acceso:</p>
        <p class="font-bold text-lg">{{ registrationCode }}</p>
      </div>
      <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <p class="text-sm">{{ errorMessage }}</p>
      </div>
      <div class="mt-10">
        <button @click="redirectToPerfil"
          class="w-full flex justify-center py-3 px-6 border border-transparent text-lg font-semibold rounded-lg text-white bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg transition ease-in-out duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400">
          Ir a Perfil
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const newUser = ref({
      nombre: '',
      telefono: '',
      rol: 'Auxiliar Administrativo'
    })
    const registrationCode = ref('')
    const errorMessage = ref('')
    const errors = ref({})
    const router = useRouter()

    const generateRandomCode = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 10; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return code;
    }

    const validateForm = () => {
      errors.value = {}
      let valid = true

      if (!newUser.value.nombre) {
        errors.value.nombre = 'El nombre es obligatorio.'
        valid = false
      }

      if (!newUser.value.telefono) {
        errors.value.telefono = 'El teléfono es obligatorio.'
        valid = false
      } else if (!/^\d{10}$/.test(newUser.value.telefono)) {
        errors.value.telefono = 'El teléfono debe tener 10 dígitos.'
        valid = false
      }

      return valid
    }

    const registerUser = async () => {
      if (!validateForm()) {
        return
      }

      try {
        newUser.value.codigo_acceso = generateRandomCode();

        const userToRegister = {
          nombre: newUser.value.nombre,
          telefono: newUser.value.telefono,
          rol: newUser.value.rol,
          codigo_acceso: newUser.value.codigo_acceso
        }

        const response = await fetch('http://localhost:3030/api/registro_usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userToRegister)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error en la respuesta del servidor.');
        }

        const data = await response.json();
        registrationCode.value = data.codigo_acceso || newUser.value.codigo_acceso
        errorMessage.value = ''
        newUser.value = { nombre: '', telefono: '', rol: 'Auxiliar Administrativo' }
      } catch (error) {
        errorMessage.value = 'Error al registrar usuario: ' + error.message
      }
    }

    const redirectToPerfil = () => {
      router.push({ name: 'Perfil' })
    }

    return {
      newUser,
      registerUser,
      registrationCode,
      errorMessage,
      errors,
      redirectToPerfil
    }
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.bg-gray-100 {
  background-color: #f3f4f6;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.py-12 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.sm\:px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.lg\:px-8 {
  padding-left: 2rem;
  padding-right: 2rem;
}

.max-w-md {
  max-width: 28rem;
}

.w-full {
  width: 100%;
}

.space-y-8> :not([hidden])~ :not([hidden]) {
  margin-top: 2rem;
}

.bg-white {
  background-color: #ffffff;
}

.p-8 {
  padding: 2rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.text-center {
  text-align: center;
}

.text-3xl {
  font-size: 1.875rem;
  line-height: 2.25rem;
}

.font-extrabold {
  font-weight: 800;
}

.text-gray-900 {
  color: #111827;
}

.mt-8 {
  margin-top: 2rem;
}

.space-y-6> :not([hidden])~ :not([hidden]) {
  margin-top: 1.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.-space-y-px> :not([hidden])~ :not([hidden]) {
  border-top-width: 0;
}

.appearance-none {
  appearance: none;
}

.rounded-none {
  border-radius: 0;
}

.relative {
  position: relative;
}

.block {
  display: block;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.border {
  border-width: 1px;
}

.border-gray-300 {
  border-color: #d1d5db;
}

.placeholder-gray-500 {
  color: #6b7280;
}

.text-gray-900 {
  color: #111827;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-indigo-500:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

.focus\:border-indigo-500:focus {
  border-color: #6366f1;
}

.focus\:z-10 {
  z-index: 10;
}

.sm\:text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.group {
  position: relative;
}

.w-full {
  width: 100%;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.border-transparent {
  border-color: transparent;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.5rem;
}

.font-semibold {
  font-weight: 600;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.text-white {
  color: #ffffff;
}

.bg-indigo-600 {
  background-color: #4f46e5;
}

.hover\:bg-indigo-700:hover {
  background-color: #4338ca;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.focus\:ring-4:focus {
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.5);
}

.focus\:ring-offset-2:focus {
  outline-offset: 2px;
}

.focus\:ring-indigo-500:focus {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5);
}

.shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.transition {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
}

.duration-300 {
  transition-duration: 300ms;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.transform {
  transform: translateZ(0);
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.mt-4 {
  margin-top: 1rem;
}

.p-4 {
  padding: 1rem;
}

.bg-green-100 {
  background-color: #d1fae5;
}

.border {
  border-width: 1px;
}

.border-green-400 {
  border-color: #34d399;
}

.text-green-700 {
  color: #065f46;
}

.rounded-md {
  border-radius: 0.375rem;
}

.font-bold {
  font-weight: 700;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.5rem;
}

.bg-red-100 {
  background-color: #fee2e2;
}

.border-red-400 {
  border-color: #f87171;
}

.text-red-700 {
  color: #b91c1c;
}

.mt-10 {
  margin-top: 2.5rem;
}

.bg-green-500 {
  background-color: #22c55e;
}

.hover\:bg-green-600:hover {
  background-color: #16a34a;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.transition {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
}

.ease-in-out {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.duration-300 {
  transition-duration: 300ms;
}

.focus\:ring-2:focus {
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.5);
}

.focus\:ring-offset-2:focus {
  outline-offset: 2px;
}

.focus\:ring-green-400:focus {
  box-shadow: 0 0 0 2px rgba(22, 163, 74, 0.5);
}
</style>
