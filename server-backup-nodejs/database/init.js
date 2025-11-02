const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '../../database/clinica.db');
const schemaPath = path.join(__dirname, '../../database/schema.sql');

// Criar diretório database se não existir
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log('📁 Diretório database criado');
}

// Criar diretório uploads se não existir
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Diretório uploads criado');
}

// Conectar ao banco de dados
const db = new Database(dbPath);

// Habilitar foreign keys
db.pragma('foreign_keys = ON');

console.log('📊 Inicializando banco de dados...');

try {
  // Ler e executar o schema
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  console.log('✅ Banco de dados inicializado com sucesso!');
  console.log(`📍 Localização: ${dbPath}`);

  // Verificar tabelas criadas
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`📋 Tabelas criadas: ${tables.map(t => t.name).join(', ')}`);

} catch (error) {
  console.error('❌ Erro ao inicializar banco de dados:', error);
  process.exit(1);
}

db.close();
console.log('🎉 Inicialização concluída!');
