document.addEventListener('DOMContentLoaded', async () => {
    const listaTarefas = document.getElementById('tarefas');
  
    try {
      const response = await fetch('/api/tarefas');
      const tarefas = await response.json();
  
      tarefas.forEach((tarefa) => {
        const item = document.createElement('li');
        item.textContent = `${tarefa.nome} - Custo: R$${tarefa.custo}`;
        listaTarefas.appendChild(item);
      });
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
    }
  });
  