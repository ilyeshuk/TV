document.addEventListener('DOMContentLoaded', () => {
    const taskDateInput = document.getElementById('task-date');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');

    addTaskButton.addEventListener('click', () => {
        const taskDate = taskDateInput.value;
        const taskText = newTaskInput.value;

        if (taskDate && taskText) {
            addTask(taskDate, taskText);
            newTaskInput.value = '';
        }
    });

    function addTask(date, text) {
        const listItem = document.createElement('li');
        const taskContent = document.createElement('span');
        taskContent.textContent = `${date}: ${text}`;
        listItem.appendChild(taskContent);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Supprimer';
        deleteButton.addEventListener('click', () => {
            taskList.removeChild(listItem);
        });
        listItem.appendChild(deleteButton);

        taskList.appendChild(listItem);
    }
});
