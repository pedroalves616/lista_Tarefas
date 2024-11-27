const db = require('../database/db');

const Tarefa = {
  listar: (callback) => {
    const query = 'SELECT id, nome, custo, data_limite, ordem FROM tarefas ORDER BY ordem';
    db.all(query, [], callback);
  },

  inserir: (tarefa, callback) => {
    const query = `
      INSERT INTO tarefas (nome, custo, data_limite, ordem) 
      VALUES (?, ?, ?, (SELECT COALESCE(MAX(ordem), 0) + 1 FROM tarefas))
    `;
    db.run(query, [tarefa.nome, tarefa.custo, tarefa.data_limite], callback);
  },

  editar: (id, tarefa, callback) => {
    const query = `
      UPDATE tarefas 
      SET nome = ?, custo = ?, data_limite = ? 
      WHERE id = ? AND NOT EXISTS (
        SELECT 1 FROM tarefas WHERE nome = ? AND id != ?
      )
    `;
    db.run(query, [tarefa.nome, tarefa.custo, tarefa.data_limite, id, tarefa.nome, id], callback);
  },

  excluir: (id, callback) => {
    const query = 'DELETE FROM tarefas WHERE id = ?';
    db.run(query, [id], callback);
  },

  alterarOrdem: (id, direcao, callback) => {
    const deslocamento = direcao === 'subir' ? -1 : 1;
    const query = `
      WITH tarefa_atual AS (
        SELECT ordem AS ordem_atual FROM tarefas WHERE id = ?
      ),
      tarefa_alvo AS (
        SELECT id, ordem FROM tarefas
        WHERE ordem = (SELECT ordem_atual + ? FROM tarefa_atual)
      )
      UPDATE tarefas
      SET ordem = CASE 
        WHEN id = ? THEN (SELECT ordem FROM tarefa_alvo)
        WHEN id = (SELECT id FROM tarefa_alvo) THEN (SELECT ordem_atual FROM tarefa_atual)
      END
      WHERE id IN (?, (SELECT id FROM tarefa_alvo));
    `;
    db.run(query, [id, deslocamento, id, id], callback);
  },
};

module.exports = Tarefa;
