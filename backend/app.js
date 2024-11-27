const express = require('express');
const tarefasRoutes = require('./routes/tarefasRoutes');
const app = express();
const port = 3000;

// Middleware para processar JSON
app.use(express.json());

// Usar rotas de tarefas
app.use('/api/tarefas', tarefasRoutes);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
