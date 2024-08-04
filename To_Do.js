document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <span>${taskText}</span>
                <button class="delete-btn">Supprimer</button>
            `;
            taskList.appendChild(taskItem);

            taskItem.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-btn')) {
                    taskList.removeChild(taskItem);
                } else {
                    taskItem.classList.toggle('completed');
                }
            });

            taskInput.value = '';
            taskInput.focus();
        }
    }
});
