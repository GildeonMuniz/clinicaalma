import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Pacientes from './views/Pacientes.vue'
import NovaFicha from './views/NovaFicha.vue'
import DetalhePaciente from './views/DetalhePaciente.vue'

// Registro do Service Worker (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration.scope)

        // Verificar atualizações periodicamente
        setInterval(() => {
          registration.update()
        }, 60000) // A cada 1 minuto
      })
      .catch(error => {
        console.error('Erro ao registrar Service Worker:', error)
      })
  })
}

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
