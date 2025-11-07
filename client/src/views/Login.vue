<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Clínica Alma</h1>
        <p>Sistema de Gestão de Atendimentos</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Usuário</label>
          <input
            id="username"
            v-model="credentials.username"
            type="text"
            class="form-control"
            placeholder="Digite seu usuário"
            required
            autocomplete="username"
          />
        </div>

        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            class="form-control"
            placeholder="Digite sua senha"
            required
            autocomplete="current-password"
          />
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>

      <div class="login-footer">
        <small>© 2025 Clínica Alma - Todos os direitos reservados</small>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../services/api'

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = null

      try {
        const response = await authAPI.login(this.credentials)

        // Log para debug - ver estrutura da resposta
        console.log('Resposta do login:', response.data)

        // Salvar token no localStorage (tentar diferentes possíveis campos)
        const token = response.data.token || response.data.accessToken || response.data.access_token
        const user = response.data.user || response.data.usuario || response.data

        if (token) {
          localStorage.setItem('auth_token', token)
          localStorage.setItem('user', JSON.stringify(user))

          // Redirecionar para home
          this.$router.push('/')
        } else {
          throw new Error('Token não encontrado na resposta')
        }

      } catch (error) {
        console.error('Erro no login:', error)
        console.error('Resposta completa:', error.response)

        if (error.response?.status === 401) {
          this.error = 'Usuário ou senha inválidos'
        } else if (error.response?.status === 404) {
          this.error = 'Endpoint de autenticação ainda não implementado'
        } else {
          this.error = 'Erro ao conectar com o servidor. Tente novamente.'
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 420px;
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.login-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.login-header p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.95rem;
}

.login-form {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.alert {
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.alert-error {
  background-color: #fee;
  color: #c33;
  border: 1px solid #fcc;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
}

.login-footer {
  background: #f5f5f5;
  padding: 1rem;
  text-align: center;
  color: #666;
}

@media (max-width: 480px) {
  .login-card {
    border-radius: 0;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
