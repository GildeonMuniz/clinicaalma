-- Schema do Banco de Dados - Clínica Alma
-- Sistema de Gestão de Terapias Espirituais

-- Tabela de Pacientes
CREATE TABLE IF NOT EXISTS pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_consulente VARCHAR(50) UNIQUE,
    nome VARCHAR(255) NOT NULL,
    idade INTEGER,
    endereco TEXT,
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    telefone_fixo VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(255),
    data_cadastro DATE,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Fichas de Atendimento
CREATE TABLE IF NOT EXISTS fichas_atendimento (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    data_atendimento DATE,

    -- Passes
    passes_humano_espirituais TEXT,
    passes_magneticos TEXT,

    -- Bioenergia marcada
    bioenergia BOOLEAN DEFAULT 0,

    -- Apometria
    apometria_realizar BOOLEAN DEFAULT 0,
    apometria_tipo VARCHAR(50), -- "Convencional" ou "Energética"
    apometria_energetica BOOLEAN DEFAULT 0,
    apometria_convencional BOOLEAN DEFAULT 0,
    apometria_sim BOOLEAN DEFAULT 0,
    apometria_nao BOOLEAN DEFAULT 0,
    apometria_urgente BOOLEAN DEFAULT 0,

    -- Evocação
    evocacao_emocional BOOLEAN DEFAULT 0,
    evocacao_espiritual BOOLEAN DEFAULT 0,
    evocacao_fisica BOOLEAN DEFAULT 0,

    -- Campo de Proteção
    campo_protecao_casa BOOLEAN DEFAULT 0,
    campo_protecao_consciente BOOLEAN DEFAULT 0,
    campo_protecao_casa_consulente BOOLEAN DEFAULT 0,

    -- Procedimentos Exclusivos
    procedimentos_especiais BOOLEAN DEFAULT 0,
    limpeza_energetica BOOLEAN DEFAULT 0,
    limpeza_energetica_campo_protecao BOOLEAN DEFAULT 0,
    ectoplasma BOOLEAN DEFAULT 0,

    -- Indicações específicas
    indicacoes_especificas TEXT,

    -- Responsáveis
    responsavel_preenchimento VARCHAR(255),
    responsavel_orientacao VARCHAR(255),

    -- Arquivos
    ficha_frente_url TEXT,
    ficha_costa_url TEXT,

    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

-- Tabela de Sessões (P1, P2, P3A, P3B, Long, P4, P5, P6, P7, P8)
CREATE TABLE IF NOT EXISTS sessoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ficha_id INTEGER NOT NULL,
    tipo_sessao VARCHAR(10) NOT NULL, -- P1, P2, P3A, P3B, Long, P4, P5, P6, P7, P8
    data_sessao1 DATE,
    data_sessao2 DATE,
    data_sessao3 DATE,
    data_sessao4 DATE,
    observacoes TEXT,

    FOREIGN KEY (ficha_id) REFERENCES fichas_atendimento(id) ON DELETE CASCADE
);

-- Tabela de Tratamentos/Receitas (Ficha Costa)
CREATE TABLE IF NOT EXISTS tratamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ficha_id INTEGER NOT NULL,

    -- Água magnetizada
    agua_magnetizada BOOLEAN DEFAULT 0,
    agua_magnetizada_detalhes TEXT,

    -- Água Viva
    agua_viva BOOLEAN DEFAULT 0,
    agua_viva_detalhes TEXT,

    -- Gotas
    gotas BOOLEAN DEFAULT 0,
    gotas_prescricao TEXT,

    -- Gel/Banho/Escalda-pés
    gel BOOLEAN DEFAULT 0,
    banho BOOLEAN DEFAULT 0,
    escalda_pes BOOLEAN DEFAULT 0,
    orientacao_uso TEXT,

    -- Floral Rescue
    floral_rescue BOOLEAN DEFAULT 0,

    -- Outros tratamentos
    meninas_gerais BOOLEAN DEFAULT 0,
    grupo_psicosocratico BOOLEAN DEFAULT 0,
    atendimento_terapeutico_pnl BOOLEAN DEFAULT 0,
    conversa_fraterna BOOLEAN DEFAULT 0,
    terapia_florais BOOLEAN DEFAULT 0,
    culto_evangelho_lar BOOLEAN DEFAULT 0,
    evangelizacao_infantojuvenil BOOLEAN DEFAULT 0,
    espaco_jovem BOOLEAN DEFAULT 0,
    frequencia_cursos_unispiritus BOOLEAN DEFAULT 0,
    colegiado_guardioes BOOLEAN DEFAULT 0,
    frequencia_estudos_evangelho BOOLEAN DEFAULT 0,
    frequencia_reunioes_publicas BOOLEAN DEFAULT 0,

    -- Leitura recomendada
    leitura_recomendada TEXT,

    -- Reuniões
    reuniao_medico_espiritual BOOLEAN DEFAULT 0,
    reuniao_medico_espiritual_data DATE,
    reuniao_pais_velhos_caboclos BOOLEAN DEFAULT 0,
    reuniao_pais_velhos_caboclos_data DATE,
    reavaliacao_tratamento BOOLEAN DEFAULT 0,

    -- Orientações complementares
    orientacoes_complementares TEXT,

    -- Observações
    observacoes TEXT,

    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (ficha_id) REFERENCES fichas_atendimento(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pacientes_codigo ON pacientes(codigo_consulente);
CREATE INDEX IF NOT EXISTS idx_pacientes_nome ON pacientes(nome);
CREATE INDEX IF NOT EXISTS idx_fichas_paciente ON fichas_atendimento(paciente_id);
CREATE INDEX IF NOT EXISTS idx_fichas_data ON fichas_atendimento(data_atendimento);
CREATE INDEX IF NOT EXISTS idx_sessoes_ficha ON sessoes(ficha_id);
CREATE INDEX IF NOT EXISTS idx_tratamentos_ficha ON tratamentos(ficha_id);

-- Triggers para atualizar data_atualizacao
CREATE TRIGGER IF NOT EXISTS update_pacientes_timestamp
AFTER UPDATE ON pacientes
BEGIN
    UPDATE pacientes SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_fichas_timestamp
AFTER UPDATE ON fichas_atendimento
BEGIN
    UPDATE fichas_atendimento SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_tratamentos_timestamp
AFTER UPDATE ON tratamentos
BEGIN
    UPDATE tratamentos SET data_atualizacao = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
