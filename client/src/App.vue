<template>
  <div id="app">
    <!-- Sync Status Indicator -->
    <SyncStatus />

    <nav class="navbar">
      <div class="container">
        <h1 class="logo">Clínica Alma</h1>
        <ul class="nav-menu">
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/pacientes">Pacientes</router-link></li>
          <li><router-link to="/nova-ficha">Nova Ficha</router-link></li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <p>&copy; 2025 Clínica Alma - Sistema de Gestão de Terapias Espirituais</p>
    </footer>
  </div>
</template>

<script>
import SyncStatus from './components/SyncStatus.vue'

export default {
  name: 'App',
  components: {
    SyncStatus
  }
}
</script>
