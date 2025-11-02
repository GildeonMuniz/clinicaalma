const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../database/clinica.db');
const schemaPath = path.join(__dirname, '../../database/schema.sql');

// Criar diretório database se não existir
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Conectar ao banco de dados
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

// Inicializar schema se o banco estiver vazio
const initDatabase = () => {
  try {
    // Verificar se as tabelas existem
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();

    if (tables.length === 0) {
      console.log('📊 Inicializando banco de dados...');

      // Ler e executar o schema
      const schema = fs.readFileSync(schemaPath, 'utf8');
      db.exec(schema);

      console.log('✅ Banco de dados inicializado com sucesso!');
    } else {
      console.log('✅ Banco de dados já existe');
    }
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Inicializar ao carregar o módulo
initDatabase();

module.exports = db;
