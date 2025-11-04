<template>
  <div id="app">
    <!-- Sync Status Indicator -->
    <SyncStatus v-if="!isLoginPage" />

    <!-- PWA Install Prompt -->
    <InstallPWA v-if="!isLoginPage" />

    <nav v-if="!isLoginPage" class="navbar">
      <div class="container">
        <h1 class="logo">Clínica Alma</h1>
        <ul class="nav-menu">
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/pacientes">Pacientes</router-link></li>
          <li><router-link to="/nova-ficha">Nova Ficha</router-link></li>
          <li><a href="#" @click.prevent="handleLogout" class="logout-btn">Sair</a></li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <footer v-if="!isLoginPage" class="footer">
      <p>&copy; 2025 Clínica Alma - Sistema de Gestão de Terapias Espirituais</p>
    </footer>
  </div>
</template>

<script>
import SyncStatus from './components/SyncStatus.vue'
import InstallPWA from './components/InstallPWA.vue'

export default {
  name: 'App',
  components: {
    SyncStatus,
    InstallPWA
  },
  computed: {
    isLoginPage() {
      return this.$route.name === 'login'
    }
  },
  methods: {
    handleLogout() {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.logout-btn {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.logout-btn:hover {
  opacity: 0.8;
}
</style>
