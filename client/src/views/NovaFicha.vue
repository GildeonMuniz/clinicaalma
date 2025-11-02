<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Nova Ficha de Atendimento</h2>
      </div>

      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <div class="upload-section">
        <h3>1. Upload das Fichas</h3>
        <p class="text-muted">Faça o upload das fichas escaneadas (frente e costa)</p>

        <div class="upload-grid">
          <div class="upload-item">
            <h4>Ficha Frente</h4>
            <div
              class="upload-area"
              @click="$refs.fichaFrenteInput.click()"
              @dragover.prevent
              @drop.prevent="handleDrop($event, 'frente')"
            >
              <div v-if="!fichaFrente">
                <div class="upload-icon">📄</div>
                <p>Clique ou arraste a ficha frente aqui</p>
              </div>
              <img v-else :src="previewFrente" class="preview-image" alt="Ficha Frente">
            </div>
            <input
              ref="fichaFrenteInput"
              type="file"
              class="file-input"
              accept="image/*"
              @change="handleFileSelect($event, 'frente')"
            >
            <button @click="openCamera('frente')" class="btn btn-camera">
              📷 Usar Câmera
            </button>
          </div>

          <div class="upload-item">
            <h4>Ficha Costa</h4>
            <div
              class="upload-area"
              @click="$refs.fichaCostaInput.click()"
              @dragover.prevent
              @drop.prevent="handleDrop($event, 'costa')"
            >
              <div v-if="!fichaCosta">
                <div class="upload-icon">📄</div>
                <p>Clique ou arraste a ficha costa aqui</p>
              </div>
              <img v-else :src="previewCosta" class="preview-image" alt="Ficha Costa">
            </div>
            <input
              ref="fichaCostaInput"
              type="file"
              class="file-input"
              accept="image/*"
              @change="handleFileSelect($event, 'costa')"
            >
            <button @click="openCamera('costa')" class="btn btn-camera">
              📷 Usar Câmera
            </button>
          </div>
        </div>

        <!-- Camera Component -->
        <CameraCapture
          ref="cameraCapture"
          :title="cameraTitle"
          @captured="handleCameraCapture"
        />

        <div v-if="fichaFrente && fichaCosta" class="btn-group mt-3">
          <button
            @click="processarFichasGPT"
            class="btn btn-success"
            :disabled="processing"
          >
            {{ processing ? 'Processando com IA...' : '🤖 Processar com ChatGPT (Recomendado)' }}
          </button>
          <button
            @click="processarFichas"
            class="btn btn-primary"
            :disabled="processing"
          >
            OCR Tesseract
          </button>
          <button
            @click="skipOCR"
            class="btn btn-secondary"
            :disabled="processing"
          >
            Manual
          </button>
        </div>
      </div>

      <div v-if="extractedData || showManualForm" class="form-section">
        <h3>3. Revisar e Salvar Dados</h3>
        <p class="text-muted">Revise os dados extraídos e faça ajustes se necessário</p>

        <form @submit.prevent="salvarFicha">
          <div class="form-group">
            <label>Código do Consulente</label>
            <input v-model="formData.codigo_consulente" type="text" class="form-control" required>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Nome Completo</label>
              <input v-model="formData.nome" type="text" class="form-control" required>
            </div>

            <div class="form-group">
              <label>Idade</label>
              <input v-model.number="formData.idade" type="number" class="form-control">
            </div>
          </div>

          <div class="form-group">
            <label>Endereço</label>
            <input v-model="formData.endereco" type="text" class="form-control">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Bairro</label>
              <input v-model="formData.bairro" type="text" class="form-control">
            </div>

            <div class="form-group">
              <label>Cidade</label>
              <input v-model="formData.cidade" type="text" class="form-control">
            </div>

            <div class="form-group">
              <label>Estado</label>
              <input v-model="formData.estado" type="text" class="form-control" maxlength="2">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Telefone Fixo</label>
              <input v-model="formData.telefone_fixo" type="text" class="form-control">
            </div>

            <div class="form-group">
              <label>Celular</label>
              <input v-model="formData.celular" type="text" class="form-control">
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="formData.email" type="email" class="form-control">
            </div>
          </div>

          <div class="form-group">
            <h4>Tipo de Tratamento</h4>

            <!-- Bioenergia -->
            <div class="checkbox-group">
              <input v-model="formData.bioenergia" type="checkbox" id="bioenergia">
              <label for="bioenergia">Bioenergia</label>
            </div>

            <!-- Apometria -->
            <div class="treatment-section">
              <div class="checkbox-group">
                <input v-model="formData.apometria_realizar" type="checkbox" id="apom-realizar">
                <label for="apom-realizar">Realizar Apometria</label>
              </div>

              <div v-if="formData.apometria_realizar" class="sub-options">
                <div class="form-group">
                  <label for="apom-tipo">Tipo de Apometria:</label>
                  <select v-model="formData.apometria_tipo" id="apom-tipo" class="form-control">
                    <option value="">Selecione...</option>
                    <option value="Convencional">Convencional</option>
                    <option value="Energética">Energética</option>
                  </select>
                </div>

                <div class="checkbox-group">
                  <input v-model="formData.apometria_urgente" type="checkbox" id="apom-urgente">
                  <label for="apom-urgente">Urgente</label>
                </div>
              </div>
            </div>

            <!-- Evocação -->
            <div class="treatment-section">
              <h5>Evocação</h5>
              <div class="checkbox-group">
                <input v-model="formData.evocacao_emocional" type="checkbox" id="evoc-emocional">
                <label for="evoc-emocional">Emocional</label>
              </div>
              <div class="checkbox-group">
                <input v-model="formData.evocacao_espiritual" type="checkbox" id="evoc-espiritual">
                <label for="evoc-espiritual">Espiritual</label>
              </div>
              <div class="checkbox-group">
                <input v-model="formData.evocacao_fisica" type="checkbox" id="evoc-fisica">
                <label for="evoc-fisica">Física</label>
              </div>
            </div>

            <!-- Campo de Proteção -->
            <div class="treatment-section">
              <h5>Campo de Proteção</h5>
              <div class="checkbox-group">
                <input v-model="formData.campo_protecao_casa" type="checkbox" id="campo-casa">
                <label for="campo-casa">Casa</label>
              </div>
              <div class="checkbox-group">
                <input v-model="formData.campo_protecao_consciente" type="checkbox" id="campo-consciente">
                <label for="campo-consciente">Consciente</label>
              </div>
              <div class="checkbox-group">
                <input v-model="formData.campo_protecao_casa_consulente" type="checkbox" id="campo-casa-consulente">
                <label for="campo-casa-consulente">Casa do Consulente</label>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Indicações Específicas</label>
            <textarea v-model="formData.indicacoes_especificas" class="form-control"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Responsável pelo Preenchimento</label>
              <input v-model="formData.responsavel_preenchimento" type="text" class="form-control">
            </div>

            <div class="form-group">
              <label>Responsável pela Orientação</label>
              <input v-model="formData.responsavel_orientacao" type="text" class="form-control">
            </div>
          </div>

          <div class="btn-group">
            <button type="submit" class="btn btn-success" :disabled="saving">
              {{ saving ? 'Salvando...' : 'Salvar Ficha' }}
            </button>
            <button type="button" @click="resetForm" class="btn btn-secondary">
              Limpar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { pacientesAPI, fichasAPI, ocrAPI } from '../services/api'
import CameraCapture from '../components/CameraCapture.vue'
import syncService from '../services/sync-service'

export default {
  name: 'NovaFicha',
  components: {
    CameraCapture
  },
  data() {
    return {
      fichaFrente: null,
      fichaCosta: null,
      previewFrente: null,
      previewCosta: null,
      processing: false,
      saving: false,
      extractedData: null,
      showManualForm: false,
      error: null,
      success: null,
      cameraType: null, // 'frente' or 'costa'
      cameraTitle: '',
      isOffline: !navigator.onLine,
      formData: {
        codigo_consulente: '',
        nome: '',
        idade: null,
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
        telefone_fixo: '',
        celular: '',
        email: '',
        data_cadastro: new Date().toISOString().split('T')[0],
        bioenergia: false,
        apometria_realizar: false,
        apometria_tipo: '',
        apometria_urgente: false,
        apometria_energetica: false,
        apometria_convencional: false,
        evocacao_emocional: false,
        evocacao_espiritual: false,
        evocacao_fisica: false,
        campo_protecao_casa: false,
        campo_protecao_consciente: false,
        campo_protecao_casa_consulente: false,
        indicacoes_especificas: '',
        responsavel_preenchimento: '',
        responsavel_orientacao: ''
      }
    }
  },
  methods: {
    handleFileSelect(event, tipo) {
      const file = event.target.files[0]
      if (file) {
        this.setFile(file, tipo)
      }
    },
    handleDrop(event, tipo) {
      const file = event.dataTransfer.files[0]
      if (file) {
        this.setFile(file, tipo)
      }
    },
    setFile(file, tipo) {
      if (tipo === 'frente') {
        this.fichaFrente = file
        this.previewFrente = URL.createObjectURL(file)
      } else {
        this.fichaCosta = file
        this.previewCosta = URL.createObjectURL(file)
      }
      this.error = null
    },
    skipOCR() {
      this.showManualForm = true
      this.success = 'Preencha os dados manualmente no formulário abaixo.'
      setTimeout(() => {
        document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    async processarFichasGPT() {
      this.processing = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('ficha_frente', this.fichaFrente)
        formData.append('ficha_costa', this.fichaCosta)

        console.log('🤖 Enviando para processar OCR completo...')

        const response = await ocrAPI.processarCompleta(formData)

        console.log('📦 Resposta completa da API:', response)
        console.log('📄 Dados recebidos (response.data):', response.data)

        // A API .NET retorna: { frente: { data: {...}, fileUrl: "..." }, costa: { data: {...}, fileUrl: "..." } }
        // Precisamos mesclar os dados de frente.data e costa.data
        const dadosFrente = response.data.frente?.data || {}
        const dadosCosta = response.data.costa?.data || {}

        // Mesclar dados da frente e costa
        const dadosMesclados = {
          ...dadosFrente,
          ...dadosCosta
        }

        console.log('🔍 Dados da frente:', dadosFrente)
        console.log('🔍 Dados da costa:', dadosCosta)
        console.log('🔍 Dados mesclados:', dadosMesclados)

        // Converter para formato do formulário
        this.extractedData = this.converterDadosOCR(dadosMesclados)

        console.log('✅ Dados convertidos para o formulário:', this.extractedData)

        // Preencher formulário com dados extraídos
        Object.assign(this.formData, this.extractedData)

        this.success = '✅ Dados extraídos! Revise os dados abaixo e salve.'

        // Scroll para o formulário
        setTimeout(() => {
          document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)

      } catch (error) {
        console.error('Erro ao processar fichas:', error)

        if (error.code === 'ECONNABORTED') {
          this.error = '⏱️ Timeout: O processamento OCR está demorando muito. A API pode estar processando imagens grandes ou o serviço pode estar ocupado. Tente novamente ou preencha manualmente.'
        } else if (error.response?.status === 400) {
          this.error = '❌ Erro 400: Verifique se ambas as fichas (frente e costa) foram enviadas corretamente.'
        } else if (error.response?.status === 500) {
          this.error = '❌ Erro no servidor: ' + (error.response?.data?.error || error.response?.data?.title || 'Erro interno do servidor')
        } else if (error.response?.data?.error?.includes('API key')) {
          this.error = '❌ API Key da OpenAI não configurada. Configure OPENAI_API_KEY no arquivo .env'
        } else {
          this.error = 'Erro ao processar fichas: ' + (error.message || 'Erro desconhecido') + '. Preencha manualmente.'
        }

        this.showManualForm = true
        setTimeout(() => {
          document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } finally {
        this.processing = false
      }
    },
    async processarFichas() {
      this.processing = true
      this.error = null

      try {
        const formData = new FormData()
        formData.append('ficha_frente', this.fichaFrente)
        formData.append('ficha_costa', this.fichaCosta)

        const response = await ocrAPI.processarCompleta(formData)

        console.log('📦 Resposta da API (Tesseract):', response.data)

        // A API .NET retorna: { frente: { data: {...}, fileUrl: "..." }, costa: { data: {...}, fileUrl: "..." } }
        const dadosFrente = response.data.frente?.data || {}
        const dadosCosta = response.data.costa?.data || {}

        // Mesclar dados da frente e costa
        const dadosMesclados = {
          ...dadosFrente,
          ...dadosCosta
        }

        console.log('🔍 Dados mesclados (Tesseract):', dadosMesclados)

        // Converter para formato do formulário
        this.extractedData = this.converterDadosOCR(dadosMesclados)

        console.log('✅ Dados convertidos (Tesseract):', this.extractedData)

        // Preencher formulário com dados extraídos
        Object.assign(this.formData, this.extractedData)

        this.success = 'Fichas processadas com sucesso! Revise os dados abaixo.'

        // Scroll para o formulário
        setTimeout(() => {
          document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)

      } catch (error) {
        console.error('Erro ao processar fichas:', error)

        if (error.code === 'ECONNABORTED') {
          this.error = '⏱️ Timeout: O processamento OCR está demorando muito. Tente novamente ou preencha manualmente.'
        } else if (error.response?.status === 400) {
          this.error = '❌ Erro 400: Verifique se ambas as fichas foram enviadas corretamente.'
        } else if (error.response?.status === 500) {
          this.error = '❌ Erro no servidor: ' + (error.response?.data?.error || error.response?.data?.title || 'Erro interno')
        } else {
          this.error = 'Erro ao processar fichas: ' + (error.message || 'Erro desconhecido')
        }

        this.showManualForm = true
        setTimeout(() => {
          document.querySelector('.form-section')?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } finally {
        this.processing = false
      }
    },
    async salvarFicha() {
      this.saving = true
      this.error = null

      try {
        // Primeiro, criar ou buscar paciente
        let paciente
        try {
          // Tentar buscar paciente existente
          const response = await pacientesAPI.buscarPorCodigo(this.formData.codigo_consulente)
          paciente = response.data
        } catch {
          // Se não encontrar, criar novo paciente
          const response = await pacientesAPI.criar({
            codigoConsulente: this.formData.codigo_consulente,
            nome: this.formData.nome,
            idade: this.formData.idade,
            endereco: this.formData.endereco,
            bairro: this.formData.bairro,
            cidade: this.formData.cidade,
            estado: this.formData.estado,
            telefoneFixo: this.formData.telefone_fixo,
            celular: this.formData.celular,
            email: this.formData.email
          })
          paciente = response.data
        }

        // Criar ficha de atendimento
        await fichasAPI.criar({
          pacienteId: paciente.id,
          dataAtendimento: new Date().toISOString().split('T')[0],
          bioenergia: this.formData.bioenergia,
          apometriaRealizar: this.formData.apometria_realizar,
          apometriaTipo: this.formData.apometria_tipo,
          apometriaUrgente: this.formData.apometria_urgente,
          evocacaoEmocional: this.formData.evocacao_emocional,
          evocacaoEspiritual: this.formData.evocacao_espiritual,
          evocacaoFisica: this.formData.evocacao_fisica,
          campoProtecaoCasa: this.formData.campo_protecao_casa,
          campoProtecaoConsciente: this.formData.campo_protecao_consciente,
          campoProtecaoCasaConsulente: this.formData.campo_protecao_casa_consulente,
          indicacoesEspecificas: this.formData.indicacoes_especificas,
          responsavelPreenchimento: this.formData.responsavel_preenchimento,
          responsavelOrientacao: this.formData.responsavel_orientacao
        })

        this.success = 'Ficha salva com sucesso!'

        // Redirecionar após 2 segundos
        setTimeout(() => {
          this.$router.push(`/paciente/${paciente.id}`)
        }, 2000)

      } catch (error) {
        console.error('Erro ao salvar ficha:', error)
        this.error = error.response?.data?.error || error.response?.data?.title || 'Erro ao salvar ficha'
      } finally {
        this.saving = false
      }
    },
    resetForm() {
      this.fichaFrente = null
      this.fichaCosta = null
      this.previewFrente = null
      this.previewCosta = null
      this.extractedData = null
      this.showManualForm = false
      this.error = null
      this.success = null
      this.formData = {
        codigo_consulente: '',
        nome: '',
        idade: null,
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
        telefone_fixo: '',
        celular: '',
        email: '',
        data_cadastro: new Date().toISOString().split('T')[0],
        bioenergia: false,
        apometria_realizar: false,
        apometria_tipo: '',
        apometria_urgente: false,
        apometria_energetica: false,
        apometria_convencional: false,
        evocacao_emocional: false,
        evocacao_espiritual: false,
        evocacao_fisica: false,
        campo_protecao_casa: false,
        campo_protecao_consciente: false,
        campo_protecao_casa_consulente: false,
        indicacoes_especificas: '',
        responsavel_preenchimento: '',
        responsavel_orientacao: ''
      }
    },
    // Converter dados do OCR (snake_case para formato do formulário)
    converterDadosOCR(dados) {
      return {
        // Dados pessoais
        codigo_consulente: dados.codigo_consulente,
        nome: dados.nome,
        idade: dados.idade,
        endereco: dados.endereco,
        bairro: dados.bairro,
        cidade: dados.cidade,
        estado: dados.estado,
        cep: dados.cep,
        telefone_fixo: dados.telefone_fixo,
        celular: dados.celular,
        email: dados.email,
        data_cadastro: dados.data_cadastro,

        // Tratamentos
        bioenergia: dados.bioenergia || false,

        // Apometria
        apometria_realizar: dados.apometria?.realizar || false,
        apometria_tipo: dados.apometria?.tipo || '',
        apometria_urgente: dados.apometria?.urgente || false,

        // Evocação
        evocacao_emocional: dados.evocacao?.emocional || false,
        evocacao_espiritual: dados.evocacao?.espiritual || false,
        evocacao_fisica: dados.evocacao?.fisica || false,

        // Campo de Proteção
        campo_protecao_casa: dados.campo_protecao?.casa || false,
        campo_protecao_consciente: dados.campo_protecao?.consciente || false,
        campo_protecao_casa_consulente: dados.campo_protecao?.casa_consulente || false,

        // Indicações e Responsáveis
        indicacoes_especificas: dados.indicacoes_especificas || '',
        responsavel_preenchimento: dados.responsavel_preenchimento || '',
        responsavel_orientacao: dados.responsavel_orientacao || ''
      }
    },
    // Camera methods
    openCamera(tipo) {
      this.cameraType = tipo
      this.cameraTitle = tipo === 'frente' ? 'Capturar Ficha Frente' : 'Capturar Ficha Costa'
      this.$refs.cameraCapture.open()
    },
    handleCameraCapture(file) {
      if (this.cameraType === 'frente') {
        this.fichaFrente = file
        this.previewFrente = URL.createObjectURL(file)
      } else {
        this.fichaCosta = file
        this.previewCosta = URL.createObjectURL(file)
      }
      this.error = null
      this.success = `Foto ${this.cameraType} capturada com sucesso!`
    }
  },
  mounted() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOffline = false
      this.success = 'Conexão restaurada! Sincronizando dados...'
      syncService.syncAll()
    })

    window.addEventListener('offline', () => {
      this.isOffline = true
      this.error = 'Modo offline ativado. Seus dados serão salvos localmente.'
    })
  }
}
</script>

<style scoped>
.upload-section,
.form-section {
  margin-top: 2rem;
}

.upload-section h3,
.form-section h3 {
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

.upload-item h4 {
  margin-bottom: 1rem;
  color: var(--dark-color);
}

.form-section {
  border-top: 2px solid var(--border-color);
  padding-top: 2rem;
}

.treatment-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid var(--primary-color);
}

.treatment-section h5 {
  margin-bottom: 1rem;
  color: var(--primary-color);
  font-size: 1.1rem;
}

.sub-options {
  margin-left: 2rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.checkbox-group {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.checkbox-group input[type="checkbox"] {
  margin-right: 0.5rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-group label {
  margin: 0;
  cursor: pointer;
  user-select: none;
}

.btn-camera {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-camera:hover {
  background-color: #4f46e5;
}

.btn-camera:active {
  transform: scale(0.98);
}
</style>
