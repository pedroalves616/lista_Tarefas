const Tarefa = require('../models/tarefasModel');

const listarTarefas = (req, res) => {
  Tarefa.listar((err, rows) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao listar tarefas' });
    } else {
      res.json(rows);
    }
  });
};

const incluirTarefa = (req, res) => {
  const { nome, custo, data_limite } = req.body;

  if (!nome || !custo || !data_limite) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  Tarefa.inserir({ nome, custo, data_limite }, (err) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao incluir tarefa' });
    } else {
      res.status(201).json({ message: 'Tarefa incluída com sucesso!' });
    }
  });
};

const editarTarefa = (req, res) => {
  const { id } = req.params;
  const { nome, custo, data_limite } = req.body;

  Tarefa.editar(id, { nome, custo, data_limite }, (err) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao editar tarefa' });
    } else {
      res.json({ message: 'Tarefa editada com sucesso!' });
    }
  });
};

const excluirTarefa = (req, res) => {
  const { id } = req.params;

  Tarefa.excluir(id, (err) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao excluir tarefa' });
    } else {
      res.json({ message: 'Tarefa excluída com sucesso!' });
    }
  });
};

const alterarOrdem = (req, res) => {
  const { id } = req.params;
  const { direcao } = req.body;

  if (!['subir', 'descer'].includes(direcao)) {
    return res.status(400).json({ error: 'Direção inválida' });
  }

  Tarefa.alterarOrdem(id, direcao, (err) => {
    if (err) {
      res.status(500).json({ error: 'Erro ao alterar ordem' });
    } else {
      res.json({ message: 'Ordem alterada com sucesso!' });
    }
  });
};

module.exports = {
  listarTarefas,
  incluirTarefa,
  editarTarefa,
  excluirTarefa,
  alterarOrdem,
};
