<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Gerenciamento de Usuários</h2>
        <button @click="abrirModalNovo" class="btn btn-primary">
          + Novo Usuário
        </button>
      </div>

      <!-- Tabela de Usuários -->
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Carregando usuários...</p>
      </div>

      <div v-else-if="error" class="alert alert-error">
        {{ error }}
      </div>

      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Usuário</th>
            <th>Email</th>
            <th>Perfil</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario.id">
            <td>{{ usuario.id }}</td>
            <td>{{ usuario.nome }}</td>
            <td>{{ usuario.nomeDoUsuario }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ getPerfilNome(usuario.perfilAcessoId) }}</td>
            <td>
              <span :class="['badge', usuario.bloqueado ? 'badge-danger' : 'badge-success']">
                {{ usuario.bloqueado ? 'Bloqueado' : 'Ativo' }}
              </span>
            </td>
            <td>
              <button @click="editarUsuario(usuario)" class="btn btn-sm btn-secondary">
                Editar
              </button>
              <button @click="deletarUsuario(usuario.id)" class="btn btn-sm btn-danger">
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de Cadastro/Edição -->
    <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modoEdicao ? 'Editar Usuário' : 'Novo Usuário' }}</h3>
          <button @click="fecharModal" class="btn-close">&times;</button>
        </div>

        <form @submit.prevent="salvarUsuario" class="modal-body">
          <div class="form-group">
            <label for="nome">Nome Completo *</label>
            <input
              id="nome"
              v-model="formulario.nome"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="nomeDoUsuario">Nome de Usuário *</label>
            <input
              id="nomeDoUsuario"
              v-model="formulario.nomeDoUsuario"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="formulario.email"
              type="email"
              class="form-control"
              required
            />
          </div>

          <div class="form-group">
            <label for="senha">Senha *</label>
            <input
              id="senha"
              v-model="formulario.senha"
              type="password"
              class="form-control"
              :required="!modoEdicao"
              placeholder="Deixe em branco para manter a senha atual"
            />
            <small v-if="modoEdicao" style="color: #666; font-size: 0.85rem;">
              Deixe em branco para não alterar a senha
            </small>
          </div>

          <div class="form-group">
            <label for="perfilAcessoId">Perfil de Acesso *</label>
            <select
              id="perfilAcessoId"
              v-model="formulario.perfilAcessoId"
              class="form-control"
              required
            >
              <option value="">Selecione...</option>
              <option value="1">Administrador</option>
              <option value="2">Operador</option>
              <option value="3">Visualizador</option>
            </select>
          </div>

          <div class="form-group">
            <label for="situacao">Situação *</label>
            <select
              id="situacao"
              v-model="formulario.situacao"
              class="form-control"
              required
            >
              <option value="1">Ativo</option>
              <option value="0">Inativo</option>
            </select>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="formulario.bloqueado"
                type="checkbox"
              />
              Bloquear usuário
            </label>
          </div>

          <div v-if="errorModal" class="alert alert-error">
            {{ errorModal }}
          </div>

          <div class="modal-footer">
            <button type="button" @click="fecharModal" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { usuariosAPI } from '../services/api'

export default {
  name: 'Usuarios',
  data() {
    return {
      usuarios: [],
      loading: true,
      error: null,
      modalAberto: false,
      modoEdicao: false,
      salvando: false,
      errorModal: null,
      formulario: {
        id: null,
        nome: '',
        nomeDoUsuario: '',
        email: '',
        senha: '',
        bloqueado: false,
        perfilAcessoId: '',
        situacao: 1,
        microsoftAccountId: null,
        pictureUrl: null,
        lastLoginAt: null
      }
    }
  },
  mounted() {
    this.carregarUsuarios()
  },
  methods: {
    async carregarUsuarios() {
      this.loading = true
      this.error = null

      try {
        const response = await usuariosAPI.listar()
        this.usuarios = response.data
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
        this.error = 'Erro ao carregar usuários. Tente novamente.'
      } finally {
        this.loading = false
      }
    },

    abrirModalNovo() {
      this.modoEdicao = false
      this.limparFormulario()
      this.modalAberto = true
    },

    editarUsuario(usuario) {
      this.modoEdicao = true
      this.formulario = { ...usuario }
      this.modalAberto = true
    },

    fecharModal() {
      this.modalAberto = false
      this.errorModal = null
      this.limparFormulario()
    },

    limparFormulario() {
      this.formulario = {
        id: null,
        nome: '',
        nomeDoUsuario: '',
        email: '',
        senha: '',
        bloqueado: false,
        perfilAcessoId: '',
        situacao: 1,
        microsoftAccountId: null,
        pictureUrl: null,
        lastLoginAt: null
      }
    },

    async salvarUsuario() {
      this.salvando = true
      this.errorModal = null

      try {
        // Preparar dados conforme API espera
        const dados = {
          nome: this.formulario.nome,
          nomeDoUsuario: this.formulario.nomeDoUsuario,
          email: this.formulario.email,
          senha: this.formulario.senha,
          perfilAcessoId: parseInt(this.formulario.perfilAcessoId),
          situacao: parseInt(this.formulario.situacao)
        }

        // Se estiver editando e senha estiver vazia, remover do objeto
        if (this.modoEdicao && !dados.senha) {
          delete dados.senha
        }

        if (this.modoEdicao) {
          await usuariosAPI.atualizar(dados.id, dados)
        } else {
          await usuariosAPI.criar(dados)
        }

        await this.carregarUsuarios()
        this.fecharModal()
      } catch (error) {
        console.error('Erro ao salvar usuário:', error)
        this.errorModal = error.response?.data?.message || 'Erro ao salvar usuário. Tente novamente.'
      } finally {
        this.salvando = false
      }
    },

    async deletarUsuario(id) {
      if (!confirm('Tem certeza que deseja excluir este usuário?')) {
        return
      }

      try {
        await usuariosAPI.deletar(id)
        await this.carregarUsuarios()
      } catch (error) {
        console.error('Erro ao deletar usuário:', error)
        alert('Erro ao deletar usuário. Tente novamente.')
      }
    },

    getPerfilNome(perfilId) {
      const perfis = {
        1: 'Administrador',
        2: 'Operador',
        3: 'Visualizador'
      }
      return perfis[perfilId] || 'Não definido'
    }
  }
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.badge-success {
  background-color: #d4edda;
  color: #155724;
}

.badge-danger {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.875rem;
  margin-right: 0.5rem;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
}

.btn-close:hover {
  color: #333;
}

.modal-body {
  padding: 1.5rem;
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
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input {
  margin-right: 0.5rem;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.alert {
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.alert-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>
