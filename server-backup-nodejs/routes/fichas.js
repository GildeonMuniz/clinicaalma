const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todas as fichas
router.get('/', (req, res) => {
  try {
    const fichas = db.prepare(`
      SELECT f.*, p.nome as paciente_nome, p.codigo_consulente
      FROM fichas_atendimento f
      JOIN pacientes p ON f.paciente_id = p.id
      ORDER BY f.data_atendimento DESC
    `).all();

    res.json(fichas);
  } catch (error) {
    console.error('Erro ao listar fichas:', error);
    res.status(500).json({ error: 'Erro ao listar fichas' });
  }
});

// Buscar ficha por ID com todos os dados relacionados
router.get('/:id', (req, res) => {
  try {
    // Buscar ficha
    const ficha = db.prepare(`
      SELECT f.*, p.nome as paciente_nome, p.codigo_consulente
      FROM fichas_atendimento f
      JOIN pacientes p ON f.paciente_id = p.id
      WHERE f.id = ?
    `).get(req.params.id);

    if (!ficha) {
      return res.status(404).json({ error: 'Ficha não encontrada' });
    }

    // Buscar sessões
    const sessoes = db.prepare('SELECT * FROM sessoes WHERE ficha_id = ?').all(req.params.id);

    // Buscar tratamentos
    const tratamento = db.prepare('SELECT * FROM tratamentos WHERE ficha_id = ?').get(req.params.id);

    res.json({
      ...ficha,
      sessoes,
      tratamento
    });
  } catch (error) {
    console.error('Erro ao buscar ficha:', error);
    res.status(500).json({ error: 'Erro ao buscar ficha' });
  }
});

// Criar nova ficha de atendimento
router.post('/', (req, res) => {
  try {
    const {
      paciente_id,
      data_atendimento,
      passes_humano_espirituais,
      passes_magneticos,
      bioenergia,
      apometria_realizar,
      apometria_tipo,
      apometria_urgente,
      apometria_energetica,
      apometria_convencional,
      apometria_sim,
      apometria_nao,
      urgente,
      evocacao_emocional,
      evocacao_espiritual,
      evocacao_fisica,
      campo_protecao_casa,
      campo_protecao_consciente,
      campo_protecao_casa_consulente,
      procedimentos_especiais,
      limpeza_energetica,
      limpeza_energetica_campo_protecao,
      ectoplasma,
      indicacoes_especificas,
      responsavel_preenchimento,
      responsavel_orientacao,
      ficha_frente_url,
      ficha_costa_url,
      sessoes,
      tratamento
    } = req.body;

    // Iniciar transação
    const insertFicha = db.transaction(() => {
      // Inserir ficha
      const fichaStmt = db.prepare(`
        INSERT INTO fichas_atendimento (
          paciente_id, data_atendimento, passes_humano_espirituais, passes_magneticos,
          bioenergia, apometria_realizar, apometria_tipo, apometria_urgente,
          apometria_energetica, apometria_convencional, apometria_sim,
          apometria_nao, urgente, evocacao_emocional, evocacao_espiritual, evocacao_fisica,
          campo_protecao_casa, campo_protecao_consciente, campo_protecao_casa_consulente,
          procedimentos_especiais, limpeza_energetica, limpeza_energetica_campo_protecao,
          ectoplasma, indicacoes_especificas, responsavel_preenchimento,
          responsavel_orientacao, ficha_frente_url, ficha_costa_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const fichaResult = fichaStmt.run(
        paciente_id, data_atendimento, passes_humano_espirituais, passes_magneticos,
        bioenergia ? 1 : 0, apometria_realizar ? 1 : 0, apometria_tipo || null, apometria_urgente ? 1 : 0,
        apometria_energetica ? 1 : 0, apometria_convencional ? 1 : 0,
        apometria_sim ? 1 : 0, apometria_nao ? 1 : 0, urgente ? 1 : 0,
        evocacao_emocional ? 1 : 0, evocacao_espiritual ? 1 : 0, evocacao_fisica ? 1 : 0,
        campo_protecao_casa ? 1 : 0, campo_protecao_consciente ? 1 : 0,
        campo_protecao_casa_consulente ? 1 : 0, procedimentos_especiais ? 1 : 0,
        limpeza_energetica ? 1 : 0, limpeza_energetica_campo_protecao ? 1 : 0,
        ectoplasma ? 1 : 0, indicacoes_especificas, responsavel_preenchimento,
        responsavel_orientacao, ficha_frente_url, ficha_costa_url
      );

      const fichaId = fichaResult.lastInsertRowid;

      // Inserir sessões se houver
      if (sessoes && sessoes.length > 0) {
        const sessaoStmt = db.prepare(`
          INSERT INTO sessoes (ficha_id, tipo_sessao, data_sessao1, data_sessao2, data_sessao3, data_sessao4, observacoes)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const sessao of sessoes) {
          sessaoStmt.run(
            fichaId,
            sessao.tipo_sessao,
            sessao.data_sessao1 || null,
            sessao.data_sessao2 || null,
            sessao.data_sessao3 || null,
            sessao.data_sessao4 || null,
            sessao.observacoes || null
          );
        }
      }

      // Inserir tratamento se houver
      if (tratamento) {
        const tratamentoStmt = db.prepare(`
          INSERT INTO tratamentos (
            ficha_id, agua_magnetizada, agua_magnetizada_detalhes, agua_viva, agua_viva_detalhes,
            gotas, gotas_prescricao, gel, banho, escalda_pes, orientacao_uso, floral_rescue,
            meninas_gerais, grupo_psicosocratico, atendimento_terapeutico_pnl, conversa_fraterna,
            terapia_florais, culto_evangelho_lar, evangelizacao_infantojuvenil, espaco_jovem,
            frequencia_cursos_unispiritus, colegiado_guardioes, frequencia_estudos_evangelho,
            frequencia_reunioes_publicas, leitura_recomendada, reuniao_medico_espiritual,
            reuniao_medico_espiritual_data, reuniao_pais_velhos_caboclos,
            reuniao_pais_velhos_caboclos_data, reavaliacao_tratamento, orientacoes_complementares,
            observacoes
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        tratamentoStmt.run(
          fichaId,
          tratamento.agua_magnetizada ? 1 : 0,
          tratamento.agua_magnetizada_detalhes || null,
          tratamento.agua_viva ? 1 : 0,
          tratamento.agua_viva_detalhes || null,
          tratamento.gotas ? 1 : 0,
          tratamento.gotas_prescricao || null,
          tratamento.gel ? 1 : 0,
          tratamento.banho ? 1 : 0,
          tratamento.escalda_pes ? 1 : 0,
          tratamento.orientacao_uso || null,
          tratamento.floral_rescue ? 1 : 0,
          tratamento.meninas_gerais ? 1 : 0,
          tratamento.grupo_psicosocratico ? 1 : 0,
          tratamento.atendimento_terapeutico_pnl ? 1 : 0,
          tratamento.conversa_fraterna ? 1 : 0,
          tratamento.terapia_florais ? 1 : 0,
          tratamento.culto_evangelho_lar ? 1 : 0,
          tratamento.evangelizacao_infantojuvenil ? 1 : 0,
          tratamento.espaco_jovem ? 1 : 0,
          tratamento.frequencia_cursos_unispiritus ? 1 : 0,
          tratamento.colegiado_guardioes ? 1 : 0,
          tratamento.frequencia_estudos_evangelho ? 1 : 0,
          tratamento.frequencia_reunioes_publicas ? 1 : 0,
          tratamento.leitura_recomendada || null,
          tratamento.reuniao_medico_espiritual ? 1 : 0,
          tratamento.reuniao_medico_espiritual_data || null,
          tratamento.reuniao_pais_velhos_caboclos ? 1 : 0,
          tratamento.reuniao_pais_velhos_caboclos_data || null,
          tratamento.reavaliacao_tratamento ? 1 : 0,
          tratamento.orientacoes_complementares || null,
          tratamento.observacoes || null
        );
      }

      return fichaId;
    });

    const fichaId = insertFicha();

    // Buscar ficha completa criada
    const ficha = db.prepare(`
      SELECT f.*, p.nome as paciente_nome, p.codigo_consulente
      FROM fichas_atendimento f
      JOIN pacientes p ON f.paciente_id = p.id
      WHERE f.id = ?
    `).get(fichaId);

    const sessoesResult = db.prepare('SELECT * FROM sessoes WHERE ficha_id = ?').all(fichaId);
    const tratamentoResult = db.prepare('SELECT * FROM tratamentos WHERE ficha_id = ?').get(fichaId);

    res.status(201).json({
      ...ficha,
      sessoes: sessoesResult,
      tratamento: tratamentoResult
    });
  } catch (error) {
    console.error('Erro ao criar ficha:', error);
    res.status(500).json({ error: 'Erro ao criar ficha' });
  }
});

// Atualizar ficha
router.put('/:id', (req, res) => {
  try {
    const { indicacoes_especificas, responsavel_preenchimento, responsavel_orientacao } = req.body;

    const stmt = db.prepare(`
      UPDATE fichas_atendimento SET
        indicacoes_especificas = ?,
        responsavel_preenchimento = ?,
        responsavel_orientacao = ?
      WHERE id = ?
    `);

    const result = stmt.run(indicacoes_especificas, responsavel_preenchimento, responsavel_orientacao, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ficha não encontrada' });
    }

    const ficha = db.prepare('SELECT * FROM fichas_atendimento WHERE id = ?').get(req.params.id);
    res.json(ficha);
  } catch (error) {
    console.error('Erro ao atualizar ficha:', error);
    res.status(500).json({ error: 'Erro ao atualizar ficha' });
  }
});

// Deletar ficha
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM fichas_atendimento WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Ficha não encontrada' });
    }

    res.json({ message: 'Ficha deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar ficha:', error);
    res.status(500).json({ error: 'Erro ao deletar ficha' });
  }
});

module.exports = router;
