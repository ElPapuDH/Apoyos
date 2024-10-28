import { createRouter, createWebHistory } from 'vue-router';
import RegistroForm from './components/RegistroForm.vue';
import VisualTab from './components/VisualTab.vue';
import GraficaComponent from './components/GraficaComponent.vue';
import AdminRegister from './components/AdminRegister.vue';
import LoginComponent from './components/LoginComponent.vue';
import HomeC from './components/HomeC.vue';
import TablaUsuarios from './components/TablaUsuarios.vue';
import PerfilComponent from './components/PerfilComponent.vue';
import VisualTabAdmin from './components/VisualTabAdmin.vue';
import AdminUsuarios from './components/AdminUsuarios.vue';


const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: HomeC
  },
  { 
    path: '/registrof', 
    name: 'RegistroF',
    component: RegistroForm 
  },
  { 
    path: '/visual',
    name: 'Visualizacion',
    component: VisualTab 
  },
  { 
    path: '/grafica', 
    name: 'Graficas',
    component: GraficaComponent 
  },
  { 
    path: '/registro', 
    name: 'Registro',
    component: AdminRegister 
  },
  { 
    path: '/login', 
    name: 'Login',
    component: LoginComponent 
  },
  { 
    path: '/tablaUs', 
    name: 'TablaUs',
    component: TablaUsuarios 
  },
  {
    path: '/perfil',
    name: 'Perfil',
    component: PerfilComponent,
  },
  { 
    path: '/visualAdmin',
    name: 'VisualizacionAdmin',
    component: VisualTabAdmin
  },
  {
    path: '/adminUs',
    name: 'AdminUs',
    component: AdminUsuarios,
  }
  
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;