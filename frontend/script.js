const API_URL = 'http://localhost:3000/tarefas';

async function carregarTarefas() {
  const response = await fetch(API_URL);
  const tarefas = await response.json();
  const tabela = document.getElementById('tarefas-table');

  tabela.innerHTML = `
    <tr>
      <th>Nome</th>
      <th>Custo</th>
      <th>Data Limite</th>
      <th>Ações</th>
    </tr>
  `;

  tarefas.forEach((tarefa) => {
    const linha = document.createElement('tr');
    linha.className = tarefa.custo >= 1000 ? 'highlight' : '';

    linha.innerHTML = `
      <td>${tarefa.nome}</td>
      <td>${tarefa.custo.toFixed(2)}</td>
      <td>${tarefa.data_limite}</td>
      <td>
        <button onclick="editarTarefa(${tarefa.id})">Editar</button>
        <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
        <button onclick="moverTarefa(${tarefa.id}, 'subir')">↑</button>
        <button onclick="moverTarefa(${tarefa.id}, 'descer')">↓</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

document.getElementById('btn-nova-tarefa').addEventListener('click', async () => {
  const nome = prompt('Nome da tarefa:');
  const custo = prompt('Custo:');
  const data_limite = prompt('Data limite (YYYY-MM-DD):');

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, custo: parseFloat(custo), data_limite }),
  });

  carregarTarefas();
});

carregarTarefas();
