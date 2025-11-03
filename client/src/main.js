import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Pacientes from './views/Pacientes.vue'
import NovaFicha from './views/NovaFicha.vue'
import DetalhePaciente from './views/DetalhePaciente.vue'
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
    { path: '/', component: Home, name: 'home' },
    { path: '/pacientes', component: Pacientes, name: 'pacientes' },
    { path: '/nova-ficha', component: NovaFicha, name: 'nova-ficha' },
    { path: '/paciente/:id', component: DetalhePaciente, name: 'detalhe-paciente' }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
