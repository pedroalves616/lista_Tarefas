const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados SQLite
const dbPath = path.resolve(__dirname, 'database', 'tarefas.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite.');
    }
});

// Criação da tabela se não existir
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL UNIQUE,
            custo REAL NOT NULL,
            data_limite TEXT NOT NULL,
            ordem INTEGER NOT NULL
        )
    `);
});

// Rotas
app.get('/tarefas', (req, res) => {
    db.all('SELECT * FROM tarefas ORDER BY ordem', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Erro ao listar tarefas.' });
        } else {
            res.json(rows);
        }
    });
});

app.post('/tarefas', (req, res) => {
    const { nome, custo, data_limite } = req.body;
    db.run(
        `INSERT INTO tarefas (nome, custo, data_limite, ordem) VALUES (?, ?, ?, (SELECT IFNULL(MAX(ordem), 0) + 1 FROM tarefas))`,
        [nome, custo, data_limite],
        function (err) {
            if (err) {
                res.status(500).json({ error: 'Erro ao adicionar tarefa.' });
            } else {
                res.status(201).json({ id: this.lastID });
            }
        }
    );
});

app.delete('/tarefas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.run('DELETE FROM tarefas WHERE id = ?', [id]);

        if (result.changes > 0) {
            res.status(200).json({ message: 'Tarefa excluída com sucesso' });
        } else {
            res.status(404).json({ message: 'Tarefa não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir tarefa' });
    }
});


// Inicialização do servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
