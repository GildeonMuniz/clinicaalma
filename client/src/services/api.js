import axios from 'axios'

// Configuração da API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

// Criar instância do axios com configuração padrão
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 240000, // 240 segundos (4 minutos) - OCR pode demorar
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para logging (opcional - remover em produção se necessário)
api.interceptors.request.use(
  config => {
    const fullUrl = `${config.baseURL}${config.url}`
    console.log(`🌐 API Request: ${config.method.toUpperCase()} ${fullUrl}`)
    return config
  },
  error => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => {
    // Log da resposta bem-sucedida
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      method: response.config.method,
      data: response.data
    })
    return response
  },
  error => {
    if (error.response) {
      // Erro retornado pelo servidor
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      })
    } else if (error.request) {
      // Requisição feita mas sem resposta
      console.error('API No Response:', error.request)
    } else {
      // Erro ao configurar a requisição
      console.error('API Setup Error:', error.message)
    }
    return Promise.reject(error)
  }
)

// Serviços da API

export const pacientesAPI = {
  // Listar todos os pacientes
  listar: () => api.get('/api/pacientes'),

  // Buscar paciente por ID
  buscarPorId: (id) => api.get(`/api/pacientes/${id}`),

  // Buscar paciente por código
  buscarPorCodigo: (codigo) => api.get(`/api/pacientes/codigo/${codigo}`),

  // Criar novo paciente
  criar: (dados) => api.post('/api/pacientes', dados),

  // Atualizar paciente
  atualizar: (id, dados) => api.put(`/api/pacientes/${id}`, dados),

  // Deletar paciente
  deletar: (id) => api.delete(`/api/pacientes/${id}`),

  // Listar fichas do paciente
  listarFichas: (id) => api.get(`/api/pacientes/${id}/fichas`)
}

export const fichasAPI = {
  // Listar todas as fichas
  listar: () => api.get('/api/fichas'),

  // Buscar ficha por ID
  buscarPorId: (id) => api.get(`/api/fichas/${id}`),

  // Criar nova ficha
  criar: (dados) => api.post('/api/fichas', dados),

  // Atualizar ficha
  atualizar: (id, dados) => api.put(`/api/fichas/${id}`, dados),

  // Deletar ficha
  deletar: (id) => api.delete(`/api/fichas/${id}`)
}

export const ocrAPI = {
  // Processar frente da ficha
  processarFrente: (formData) =>
    api.post('/api/ocr/ficha-frente', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Processar costa da ficha
  processarCosta: (formData) =>
    api.post('/api/ocr/ficha-costa', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  // Processar ficha completa
  processarCompleta: (formData) =>
    api.post('/api/ocr/ficha-completa', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
}

export const healthAPI = {
  // Verificar saúde da API
  check: () => api.get('/health')
}

// Exportar a instância do axios configurada
export default api
