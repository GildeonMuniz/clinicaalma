import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Pacientes from './views/Pacientes.vue'
import NovaFicha from './views/NovaFicha.vue'
import DetalhePaciente from './views/DetalhePaciente.vue'
import Usuarios from './views/Usuarios.vue'
import { registerSW } from 'virtual:pwa-register'

// Registro do Service Worker com vite-plugin-pwa
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Nova versão disponível. Atualizar agora?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App pronto para funcionar offline!')
  },
  immediate: true
})

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      component: Login,
      name: 'login',
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: Home,
      name: 'home',
      meta: { requiresAuth: true }
    },
    {
      path: '/pacientes',
      component: Pacientes,
      name: 'pacientes',
      meta: { requiresAuth: true }
    },
    {
      path: '/nova-ficha',
      component: NovaFicha,
      name: 'nova-ficha',
      meta: { requiresAuth: true }
    },
    {
      path: '/paciente/:id',
      component: DetalhePaciente,
      name: 'detalhe-paciente',
      meta: { requiresAuth: true }
    },
    {
      path: '/usuarios',
      component: Usuarios,
      name: 'usuarios',
      meta: { requiresAuth: true }
    }
  ]
})


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('auth_token')
  const isAuthenticated = !!token

  // Se a rota requer autenticação e usuário não está autenticado
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  }
  // Se usuário já está autenticado tentando acessar login
  else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'home' })
  }
  // Permite navegação
  else {
    next()
  }
})

const app = createApp(App)
app.use(router)
app.mount('#app')
