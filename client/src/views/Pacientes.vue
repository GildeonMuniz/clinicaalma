<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Pacientes</h2>
      </div>

      <div class="search-bar">
        <input
          v-model="searchTerm"
          type="text"
          class="form-control"
          placeholder="Buscar por nome ou código..."
        >
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
      </div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>Cidade</th>
            <th>Telefone</th>
            <th>Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paciente in filteredPacientes" :key="paciente.id">
            <td>{{ paciente.codigo_consulente }}</td>
            <td>{{ paciente.nome }}</td>
            <td>{{ paciente.idade }}</td>
            <td>{{ paciente.cidade }}</td>
            <td>{{ paciente.celular || paciente.telefone_fixo }}</td>
            <td>{{ formatDate(paciente.data_cadastro) }}</td>
            <td class="table-actions">
              <router-link
                :to="`/paciente/${paciente.id}`"
                class="btn btn-primary"
              >
                Ver
              </router-link>
            </td>
          </tr>
          <tr v-if="filteredPacientes.length === 0">
            <td colspan="7" class="text-center">Nenhum paciente encontrado</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { pacientesAPI } from '../services/api'

export default {
  name: 'Pacientes',
  data() {
    return {
      pacientes: [],
      searchTerm: '',
      loading: true
    }
  },
  computed: {
    filteredPacientes() {
      if (!this.searchTerm) return this.pacientes

      const term = this.searchTerm.toLowerCase()
      return this.pacientes.filter(p =>
        p.nome?.toLowerCase().includes(term) ||
        p.codigoConsulente?.toLowerCase().includes(term) ||
        p.codigo_consulente?.toLowerCase().includes(term)
      )
    }
  },
  mounted() {
    this.loadPacientes()
  },
  methods: {
    async loadPacientes() {
      try {
        const response = await pacientesAPI.listar()
        this.pacientes = response.data
        this.loading = false
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error)
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
.search-bar {
  margin-bottom: 1.5rem;
}
</style>
