import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Pacientes from './views/Pacientes.vue'
import NovaFicha from './views/NovaFicha.vue'
import DetalhePaciente from './views/DetalhePaciente.vue'

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
