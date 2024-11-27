const express = require('express');
const router = express.Router();
const tarefasController = require('../controllers/tarefasController');

router.get('/', tarefasController.listarTarefas);
router.post('/', tarefasController.incluirTarefa);
router.put('/:id', tarefasController.editarTarefa);
router.delete('/:id', tarefasController.excluirTarefa);
router.patch('/:id/ordem', tarefasController.alterarOrdem);

module.exports = router;
