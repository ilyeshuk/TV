document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskModal = document.getElementById('taskModal');
    const closeModal = taskModal.querySelector('.close');
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    // Fonction pour afficher le modal
    const showModal = () => {
        taskModal.style.display = 'block';
    };

    // Fonction pour fermer le modal
    const closeModalFn = () => {
        taskModal.style.display = 'none';
    };

    // Fonction pour ajouter une tâche
    const addTask = (event) => {
        event.preventDefault();

        const title = document.getElementById('taskTitle').value;
        const date = document.getElementById('taskDate').value;
        const description = document.getElementById('taskDescription').value;

        if (title) {
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            taskItem.innerHTML = `
                <h3>${title}</h3>
                <p>Date: ${date}</p>
                <p>${description}</p>
            `;
            taskList.appendChild(taskItem);

            taskForm.reset();
            closeModalFn();
        }
    };

    // Événements
    addTaskBtn.addEventListener('click', showModal);
    closeModal.addEventListener('click', closeModalFn);
    window.addEventListener('click', (event) => {
        if (event.target === taskModal) {
            closeModalFn();
        }
    });
    taskForm.addEventListener('submit', addTask);
});
