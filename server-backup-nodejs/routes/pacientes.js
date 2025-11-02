const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todos os pacientes
router.get('/', (req, res) => {
  try {
    const pacientes = db.prepare(`
      SELECT * FROM pacientes
      ORDER BY data_criacao DESC
    `).all();

    res.json(pacientes);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro ao listar pacientes' });
  }
});

// Buscar paciente por ID
router.get('/:id', (req, res) => {
  try {
    const paciente = db.prepare('SELECT * FROM pacientes WHERE id = ?').get(req.params.id);

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
});

// Buscar paciente por código
router.get('/codigo/:codigo', (req, res) => {
  try {
    const paciente = db.prepare('SELECT * FROM pacientes WHERE codigo_consulente = ?').get(req.params.codigo);

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
});

// Criar novo paciente
router.post('/', (req, res) => {
  try {
    const {
      codigo_consulente,
      nome,
      idade,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      telefone_fixo,
      celular,
      email,
      data_cadastro
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO pacientes (
        codigo_consulente, nome, idade, endereco, bairro, cidade, estado,
        cep, telefone_fixo, celular, email, data_cadastro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      codigo_consulente, nome, idade, endereco, bairro, cidade, estado,
      cep, telefone_fixo, celular, email, data_cadastro
    );

    const paciente = db.prepare('SELECT * FROM pacientes WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(paciente);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);

    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Código de consulente já existe' });
    }

    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
});

// Atualizar paciente
router.put('/:id', (req, res) => {
  try {
    const {
      codigo_consulente,
      nome,
      idade,
      endereco,
      bairro,
      cidade,
      estado,
      cep,
      telefone_fixo,
      celular,
      email
    } = req.body;

    const stmt = db.prepare(`
      UPDATE pacientes SET
        codigo_consulente = ?,
        nome = ?,
        idade = ?,
        endereco = ?,
        bairro = ?,
        cidade = ?,
        estado = ?,
        cep = ?,
        telefone_fixo = ?,
        celular = ?,
        email = ?
      WHERE id = ?
    `);

    const result = stmt.run(
      codigo_consulente, nome, idade, endereco, bairro, cidade, estado,
      cep, telefone_fixo, celular, email, req.params.id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    const paciente = db.prepare('SELECT * FROM pacientes WHERE id = ?').get(req.params.id);
    res.json(paciente);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
});

// Deletar paciente
router.delete('/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM pacientes WHERE id = ?');
    const result = stmt.run(req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    res.json({ message: 'Paciente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar paciente:', error);
    res.status(500).json({ error: 'Erro ao deletar paciente' });
  }
});

// Buscar histórico de fichas do paciente
router.get('/:id/fichas', (req, res) => {
  try {
    const fichas = db.prepare(`
      SELECT f.*,
        (SELECT COUNT(*) FROM sessoes WHERE ficha_id = f.id) as total_sessoes
      FROM fichas_atendimento f
      WHERE f.paciente_id = ?
      ORDER BY f.data_atendimento DESC
    `).all(req.params.id);

    res.json(fichas);
  } catch (error) {
    console.error('Erro ao buscar fichas:', error);
    res.status(500).json({ error: 'Erro ao buscar fichas' });
  }
});

module.exports = router;
