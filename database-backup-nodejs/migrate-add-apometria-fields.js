const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'clinica.db');
const db = new Database(dbPath);

console.log('Adding new apometria fields to fichas_atendimento table...');

try {
  // Check if columns already exist
  const columns = db.prepare("PRAGMA table_info(fichas_atendimento)").all();
  const columnNames = columns.map(col => col.name);

  // Add apometria_realizar if it doesn't exist
  if (!columnNames.includes('apometria_realizar')) {
    db.prepare('ALTER TABLE fichas_atendimento ADD COLUMN apometria_realizar BOOLEAN DEFAULT 0').run();
    console.log('✓ Added column: apometria_realizar');
  } else {
    console.log('○ Column already exists: apometria_realizar');
  }

  // Add apometria_tipo if it doesn't exist
  if (!columnNames.includes('apometria_tipo')) {
    db.prepare('ALTER TABLE fichas_atendimento ADD COLUMN apometria_tipo VARCHAR(50)').run();
    console.log('✓ Added column: apometria_tipo');
  } else {
    console.log('○ Column already exists: apometria_tipo');
  }

  // Add apometria_urgente if it doesn't exist
  if (!columnNames.includes('apometria_urgente')) {
    db.prepare('ALTER TABLE fichas_atendimento ADD COLUMN apometria_urgente BOOLEAN DEFAULT 0').run();
    console.log('✓ Added column: apometria_urgente');
  } else {
    console.log('○ Column already exists: apometria_urgente');
  }

  console.log('\nMigration completed successfully!');
} catch (error) {
  console.error('Error during migration:', error);
  process.exit(1);
} finally {
  db.close();
}
