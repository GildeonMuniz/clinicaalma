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
          <li class="dropdown" @mouseenter="dropdownOpen = true" @mouseleave="dropdownOpen = false">
            <a href="#" @click.prevent class="dropdown-toggle">
              Administrar <span class="arrow">▼</span>
            </a>
            <ul v-show="dropdownOpen" class="dropdown-menu">
              <li><router-link to="/usuarios">Usuários</router-link></li>
            </ul>
          </li>
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
  data() {
    return {
      dropdownOpen: false
    }
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

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.arrow {
  font-size: 0.7em;
  transition: transform 0.2s;
}

.dropdown:hover .arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
  list-style: none;
  z-index: 1000;
}

.dropdown-menu li {
  margin: 0;
}

.dropdown-menu a {
  display: block;
  padding: 0.75rem 1.25rem;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-menu a:hover {
  background-color: #f5f5f5;
}

.dropdown-menu a.router-link-active {
  background-color: #667eea;
  color: white;
}
</style>
