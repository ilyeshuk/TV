// Gestion des tâches
let tasks = [];
let taskHistory = {};

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateTaskList();
    initializeCalendar();
    document.querySelector('.task-form').addEventListener('submit', addTask);
});

function addTask(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task');
    const taskDateInput = document.getElementById('task-date');
    const task = taskInput.value.trim();
    const taskDate = taskDateInput.value;

    if (task === '' || tasks.some(t => t.name.toLowerCase() === task.toLowerCase())) return false;

    tasks.push({ name: task, done: false, date: taskDate });
    updateTaskList();
    saveToLocalStorage();

    taskInput.value = '';
    taskDateInput.value = '';
    return false;
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    saveToLocalStorage();
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = taskList.insertRow();
        row.innerHTML = `
            <td>${task.name} (${task.date})</td>
            <td>
                <input type="checkbox" onchange="toggleTask(${index}, this)" ${task.done ? 'checked' : ''}>
                <button class="delete-button" onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        if (task.done) {
            row.classList.add('task-done-today');
        }
    });
}

function toggleTask(index, checkbox) {
    tasks[index].done = checkbox.checked;
    updateTaskList();
    saveToLocalStorage();

    const taskList = document.getElementById('task-list');
    const rows = taskList.getElementsByTagName('tr');
    rows[index].classList.toggle('task-done-today', tasks[index].done);
}

function initializeCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.style.border = '1px solid #ccc';
        dayElement.style.padding = '10px';
        dayElement.style.textAlign = 'center';
        calendar.appendChild(dayElement);
    });

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        dayElement.textContent = i;
        dayElement.style.border = '1px solid #ccc';
        dayElement.style.padding = '10px';
        dayElement.style.textAlign = 'center';
        calendar.appendChild(dayElement);
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

function resetData() {
    tasks = [];
    saveToLocalStorage();
    updateTaskList();
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
