const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/tarefas.db');

// Criação da tabela (executada apenas se não existir)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tarefas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE,
      custo REAL NOT NULL,
      data_limite DATE NOT NULL,
      ordem INTEGER NOT NULL
    )
  `);
});

module.exports = db;
