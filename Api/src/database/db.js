const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Diretório para dados persistentes (configurável via env)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../../data');

// Criar diretório de dados se não existir
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const dbPath = path.join(DATA_DIR, 'treinos.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

function inicializarBanco() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    
    if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        db.exec(schema);
        console.log('✅ Banco inicializado em:', dbPath);
    }

    // Popular com dados iniciais (exercícios e grupos musculares)
    const { seedBanco } = require('./seed');
    seedBanco();
}

module.exports = { db, inicializarBanco };