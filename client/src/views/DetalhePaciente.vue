<template>
  <div class="container">
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
    </div>

    <div v-else-if="paciente" class="patient-detail">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">{{ paciente.nome }}</h2>
          <router-link to="/pacientes" class="btn btn-secondary">Voltar</router-link>
        </div>

        <div class="patient-info">
          <div class="info-grid">
            <div class="info-item">
              <strong>Código:</strong>
              <span>{{ paciente.codigo_consulente }}</span>
            </div>
            <div class="info-item">
              <strong>Idade:</strong>
              <span>{{ paciente.idade }} anos</span>
            </div>
            <div class="info-item">
              <strong>Email:</strong>
              <span>{{ paciente.email || '-' }}</span>
            </div>
            <div class="info-item">
              <strong>Celular:</strong>
              <span>{{ paciente.celular || '-' }}</span>
            </div>
            <div class="info-item">
              <strong>Telefone:</strong>
              <span>{{ paciente.telefone_fixo || '-' }}</span>
            </div>
            <div class="info-item">
              <strong>Data Cadastro:</strong>
              <span>{{ formatDate(paciente.data_cadastro) }}</span>
            </div>
          </div>

          <div class="address-section">
            <strong>Endereço:</strong>
            <p>
              {{ paciente.endereco }}<br>
              {{ paciente.bairro }} - {{ paciente.cidade }}/{{ paciente.estado }}<br>
              CEP: {{ paciente.cep }}
            </p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Histórico de Atendimentos</h3>
        </div>

        <div v-if="fichas.length === 0" class="text-center text-muted">
          <p>Nenhum atendimento registrado</p>
        </div>

        <div v-else class="fichas-list">
          <div v-for="ficha in fichas" :key="ficha.id" class="ficha-card">
            <div class="ficha-header">
              <h4>Atendimento - {{ formatDate(ficha.data_atendimento) }}</h4>
              <button @click="toggleFicha(ficha.id)" class="btn btn-primary btn-sm">
                {{ expandedFichas.includes(ficha.id) ? 'Ocultar' : 'Ver Detalhes' }}
              </button>
            </div>

            <div v-if="expandedFichas.includes(ficha.id)" class="ficha-details">
              <!-- Tipo de Tratamento -->
              <div class="detail-section">
                <h5>🔮 Tipo de Tratamento</h5>
                <div class="treatment-tags">
                  <span v-if="ficha.bioenergia" class="tag">Bioenergia</span>
                  <span v-if="ficha.apometria_realizar" class="tag tag-apometria">
                    Apometria {{ ficha.apometria_tipo ? `(${ficha.apometria_tipo})` : '' }}
                    <span v-if="ficha.apometria_urgente" class="urgente-badge">URGENTE</span>
                  </span>
                  <span v-if="ficha.apometria_energetica" class="tag">Apometria Energética</span>
                  <span v-if="ficha.apometria_convencional" class="tag">Apometria Convencional</span>
                </div>

                <!-- Evocação -->
                <div v-if="ficha.evocacao_emocional || ficha.evocacao_espiritual || ficha.evocacao_fisica" class="sub-treatment-section">
                  <strong>Evocação:</strong>
                  <div class="sub-tags">
                    <span v-if="ficha.evocacao_emocional" class="sub-tag">Emocional</span>
                    <span v-if="ficha.evocacao_espiritual" class="sub-tag">Espiritual</span>
                    <span v-if="ficha.evocacao_fisica" class="sub-tag">Física</span>
                  </div>
                </div>

                <!-- Campo de Proteção -->
                <div v-if="ficha.campo_protecao_casa || ficha.campo_protecao_consciente || ficha.campo_protecao_casa_consulente" class="sub-treatment-section">
                  <strong>Campo de Proteção:</strong>
                  <div class="sub-tags">
                    <span v-if="ficha.campo_protecao_casa" class="sub-tag">Casa</span>
                    <span v-if="ficha.campo_protecao_consciente" class="sub-tag">Consciente</span>
                    <span v-if="ficha.campo_protecao_casa_consulente" class="sub-tag">Casa do Consulente</span>
                  </div>
                </div>
              </div>

              <!-- Passes -->
              <div v-if="ficha.passes_humano_espirituais || ficha.passes_magneticos" class="detail-section">
                <h5>🙏 Passes</h5>
                <p v-if="ficha.passes_humano_espirituais"><strong>Humano-Espirituais:</strong> {{ ficha.passes_humano_espirituais }}</p>
                <p v-if="ficha.passes_magneticos"><strong>Magnéticos:</strong> {{ ficha.passes_magneticos }}</p>
              </div>

              <!-- Sessões -->
              <div v-if="ficha.sessoes && ficha.sessoes.length > 0" class="detail-section">
                <h5>📅 Sessões Agendadas</h5>
                <div class="sessions-grid">
                  <div v-for="sessao in ficha.sessoes" :key="sessao.id" class="session-item">
                    <strong>{{ sessao.tipo_sessao }}:</strong>
                    <span>{{ formatSessionDates(sessao) }}</span>
                  </div>
                </div>
              </div>

              <!-- Tratamentos Prescritos -->
              <div v-if="ficha.tratamento" class="detail-section">
                <h5>💊 Atividades e Recomendações Prescritas</h5>

                <!-- Água Magnetizada -->
                <div v-if="ficha.tratamento.agua_magnetizada" class="treatment-item">
                  <strong>💧 Água Magnetizada</strong>
                  <p v-if="ficha.tratamento.agua_magnetizada_detalhes">{{ ficha.tratamento.agua_magnetizada_detalhes }}</p>
                </div>

                <!-- Água Viva -->
                <div v-if="ficha.tratamento.agua_viva" class="treatment-item">
                  <strong>💧 Água Viva</strong>
                  <p v-if="ficha.tratamento.agua_viva_detalhes">{{ ficha.tratamento.agua_viva_detalhes }}</p>
                </div>

                <!-- Gotas -->
                <div v-if="ficha.tratamento.gotas" class="treatment-item">
                  <strong>💊 Gotas</strong>
                  <p v-if="ficha.tratamento.gotas_prescricao">{{ ficha.tratamento.gotas_prescricao }}</p>
                </div>

                <!-- Floral Rescue -->
                <div v-if="ficha.tratamento.floral_rescue" class="treatment-item">
                  <strong>🌸 Floral Rescue</strong>
                </div>

                <!-- Gel/Banho/Escalda-pés -->
                <div v-if="ficha.tratamento.gel || ficha.tratamento.banho || ficha.tratamento.escalda_pes" class="treatment-item">
                  <strong>🧴 Uso Tópico</strong>
                  <ul>
                    <li v-if="ficha.tratamento.gel">Gel</li>
                    <li v-if="ficha.tratamento.banho">Banho</li>
                    <li v-if="ficha.tratamento.escalda_pes">Escalda-pés</li>
                  </ul>
                  <p v-if="ficha.tratamento.orientacao_uso">{{ ficha.tratamento.orientacao_uso }}</p>
                </div>

                <!-- Terapias e Grupos -->
                <div class="treatment-item">
                  <strong>👥 Terapias e Grupos Recomendados</strong>
                  <ul class="therapy-list">
                    <li v-if="ficha.tratamento.grupo_psicosocratico">Grupo Psicoterapêutico</li>
                    <li v-if="ficha.tratamento.atendimento_terapeutico_pnl">Atendimento Terapêutico (PNL)</li>
                    <li v-if="ficha.tratamento.conversa_fraterna">Conversa Fraterna</li>
                    <li v-if="ficha.tratamento.terapia_florais">Terapia com Florais</li>
                    <li v-if="ficha.tratamento.culto_evangelho_lar">Culto do Evangelho no Lar</li>
                    <li v-if="ficha.tratamento.colegiado_guardioes">Colegiado de Guardiões da Humanidade</li>
                    <li v-if="ficha.tratamento.evangelizacao_infantojuvenil">Evangelização Infanto-Juvenil</li>
                    <li v-if="ficha.tratamento.espaco_jovem">Espaço Jovem</li>
                    <li v-if="ficha.tratamento.frequencia_cursos_unispiritus">Frequência aos Cursos UniSpiritus</li>
                  </ul>
                </div>

                <!-- Leitura Recomendada -->
                <div v-if="ficha.tratamento.leitura_recomendada" class="treatment-item">
                  <strong>📚 Leitura Recomendada</strong>
                  <p>{{ ficha.tratamento.leitura_recomendada }}</p>
                </div>

                <!-- Reuniões -->
                <div v-if="ficha.tratamento.reuniao_pais_velhos_caboclos || ficha.tratamento.reuniao_medico_espiritual" class="treatment-item">
                  <strong>📅 Reuniões Agendadas</strong>
                  <ul>
                    <li v-if="ficha.tratamento.reuniao_pais_velhos_caboclos">
                      Pais-Velhos e Caboclos
                      <span v-if="ficha.tratamento.reuniao_pais_velhos_caboclos_data"> - {{ formatDate(ficha.tratamento.reuniao_pais_velhos_caboclos_data) }}</span>
                    </li>
                    <li v-if="ficha.tratamento.reuniao_medico_espiritual">
                      Médico Espiritual
                      <span v-if="ficha.tratamento.reuniao_medico_espiritual_data"> - {{ formatDate(ficha.tratamento.reuniao_medico_espiritual_data) }}</span>
                    </li>
                  </ul>
                </div>

                <!-- Orientações Complementares -->
                <div v-if="ficha.tratamento.orientacoes_complementares" class="treatment-item highlight">
                  <strong>📝 Orientações Complementares</strong>
                  <p class="orientation-text">{{ ficha.tratamento.orientacoes_complementares }}</p>
                </div>

                <!-- Observações -->
                <div v-if="ficha.tratamento.observacoes" class="treatment-item highlight">
                  <strong>⚠️ Observações Importantes</strong>
                  <p class="observation-text">{{ ficha.tratamento.observacoes }}</p>
                </div>
              </div>

              <!-- Indicações Específicas -->
              <div v-if="ficha.indicacoes_especificas" class="detail-section">
                <h5>📋 Indicações Específicas</h5>
                <p class="indication-text">{{ ficha.indicacoes_especificas }}</p>
              </div>

              <!-- Responsáveis -->
              <div class="detail-section">
                <h5>✍️ Responsáveis</h5>
                <p><strong>Preenchimento:</strong> {{ ficha.responsavel_preenchimento || '-' }}</p>
                <p><strong>Orientação:</strong> {{ ficha.responsavel_orientacao || '-' }}</p>
              </div>

              <!-- Fichas Escaneadas -->
              <div v-if="ficha.ficha_frente_url || ficha.ficha_costa_url" class="detail-section">
                <h5>📎 Fichas Escaneadas</h5>
                <div class="scanned-fichas">
                  <a v-if="ficha.ficha_frente_url" :href="ficha.ficha_frente_url" target="_blank" class="btn btn-secondary btn-sm">
                    📄 Ver Ficha Frente
                  </a>
                  <a v-if="ficha.ficha_costa_url" :href="ficha.ficha_costa_url" target="_blank" class="btn btn-secondary btn-sm">
                    📄 Ver Ficha Costa
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card">
      <p class="text-center text-muted">Paciente não encontrado</p>
    </div>
  </div>
</template>

<script>
import { pacientesAPI } from '../services/api'

export default {
  name: 'DetalhePaciente',
  data() {
    return {
      paciente: null,
      fichas: [],
      expandedFichas: [],
      loading: true
    }
  },
  mounted() {
    this.loadPaciente()
  },
  methods: {
    async loadPaciente() {
      try {
        const id = this.$route.params.id
        const [pacienteRes, fichasRes] = await Promise.all([
          pacientesAPI.buscarPorId(id),
          pacientesAPI.listarFichas(id)
        ])

        this.paciente = pacienteRes.data
        this.fichas = fichasRes.data
        this.loading = false
      } catch (error) {
        console.error('Erro ao carregar paciente:', error)
        this.loading = false
      }
    },
    toggleFicha(id) {
      const index = this.expandedFichas.indexOf(id)
      if (index > -1) {
        this.expandedFichas.splice(index, 1)
      } else {
        this.expandedFichas.push(id)
      }
    },
    formatDate(date) {
      if (!date) return '-'
      return new Date(date).toLocaleDateString('pt-BR')
    },
    formatSessionDates(sessao) {
      const dates = [
        sessao.data_sessao1,
        sessao.data_sessao2,
        sessao.data_sessao3,
        sessao.data_sessao4
      ].filter(d => d).map(d => this.formatDate(d))

      return dates.length > 0 ? dates.join(', ') : 'Não agendada'
    }
  }
}
</script>

<style scoped>
.patient-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.patient-info {
  padding: 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item strong {
  color: var(--primary-color);
  font-size: 0.9rem;
}

.info-item span {
  font-size: 1.1rem;
}

.address-section {
  padding: 1.5rem;
  background-color: var(--light-color);
  border-radius: 8px;
}

.address-section strong {
  color: var(--primary-color);
  display: block;
  margin-bottom: 0.5rem;
}

.fichas-list {
  padding: 1rem 0;
}

.ficha-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background-color: #fafafa;
}

.ficha-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.ficha-header h4 {
  color: var(--primary-color);
}

.ficha-details {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h5 {
  color: var(--dark-color);
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.treatment-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  position: relative;
}

.tag-apometria {
  background: linear-gradient(135deg, #7b2cbf, #c77dff);
}

.urgente-badge {
  background: #dc3545;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.sub-treatment-section {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid var(--primary-color);
}

.sub-treatment-section strong {
  display: block;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.sub-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.sub-tag {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 15px;
  font-size: 0.85rem;
  border: 1px solid #dee2e6;
}

.scanned-fichas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Estilos para tratamentos */
.treatment-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary-color);
}

.treatment-item.highlight {
  background: #fff3cd;
  border-left-color: #ffc107;
}

.treatment-item strong {
  display: block;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.treatment-item ul {
  margin: 0.5rem 0 0 1.5rem;
  list-style-type: disc;
}

.treatment-item li {
  margin: 0.25rem 0;
}

.therapy-list li {
  color: #495057;
}

.orientation-text,
.observation-text,
.indication-text {
  white-space: pre-wrap;
  line-height: 1.6;
  color: #212529;
  background: white;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 0.5rem;
}

.observation-text {
  font-weight: 500;
  color: #856404;
}

/* Sessões */
.sessions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.session-item {
  background: #e7f3ff;
  padding: 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #007bff;
}

.session-item strong {
  display: block;
  color: #0056b3;
  margin-bottom: 0.25rem;
}

.session-item span {
  font-size: 0.9rem;
  color: #495057;
}
</style>
