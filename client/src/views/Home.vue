<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Bem-vindo ao Sistema Clínica Alma</h2>
      </div>
      <div class="dashboard">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>{{ stats.totalPacientes }}</h3>
              <p>Pacientes Cadastrados</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-info">
              <h3>{{ stats.totalFichas }}</h3>
              <p>Fichas de Atendimento</p>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <h3>{{ stats.atendimentosHoje }}</h3>
              <p>Atendimentos Hoje</p>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Ações Rápidas</h3>
          <div class="action-buttons">
            <router-link to="/nova-ficha" class="action-btn">
              <span class="action-icon">➕</span>
              <span>Nova Ficha</span>
            </router-link>
            <router-link to="/pacientes" class="action-btn">
              <span class="action-icon">👥</span>
              <span>Ver Pacientes</span>
            </router-link>
          </div>
        </div>

        <div class="recent-activity">
          <h3>Últimos Atendimentos</h3>
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
          </div>
          <table v-else class="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Paciente</th>
                <th>Código</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ficha in recentFichas" :key="ficha.id">
                <td>{{ formatDate(ficha.data_atendimento) }}</td>
                <td>{{ ficha.paciente_nome }}</td>
                <td>{{ ficha.codigo_consulente }}</td>
                <td>
                  <router-link :to="`/paciente/${ficha.paciente_id}`" class="btn btn-primary btn-sm">
                    Ver Detalhes
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      stats: {
        totalPacientes: 0,
        totalFichas: 0,
        atendimentosHoje: 0
      },
      recentFichas: [],
      loading: true
    }
  },
  mounted() {
    this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      try {
        const [pacientesRes, fichasRes] = await Promise.all([
          axios.get('/api/pacientes'),
          axios.get('/api/fichas')
        ])

        this.stats.totalPacientes = pacientesRes.data.length
        this.stats.totalFichas = fichasRes.data.length

        // Contar atendimentos de hoje
        const hoje = new Date().toISOString().split('T')[0]
        this.stats.atendimentosHoje = fichasRes.data.filter(f =>
          f.data_atendimento === hoje
        ).length

        // Pegar últimas 5 fichas
        this.recentFichas = fichasRes.data.slice(0, 5)

        this.loading = false
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
        this.loading = false
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 1rem 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.stat-icon {
  font-size: 3rem;
}

.stat-info h3 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-info p {
  font-size: 1rem;
  opacity: 0.9;
}

.quick-actions {
  margin: 2rem 0;
}

.quick-actions h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: white;
  border: 2px solid var(--primary-color);
  border-radius: 8px;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}

.action-btn:hover {
  background: var(--primary-color);
  color: white;
}

.action-icon {
  font-size: 1.5rem;
}

.recent-activity {
  margin-top: 2rem;
}

.recent-activity h3 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}
</style>
