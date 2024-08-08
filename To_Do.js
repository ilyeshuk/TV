let tasks = [];
let taskHistory = {};

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateTaskList();
    initializeCalendar(new Date().getFullYear(), new Date().getMonth());
    document.querySelector('.task-form').addEventListener('submit', addTask);
});

function addTask(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task');
    const taskDateInput = document.getElementById('task-date');
    const task = taskInput.value.trim();
    const taskDate = taskDateInput.value ? formatDate(taskDateInput.value) : '';

    if (task === '' || tasks.some(t => t.name.toLowerCase() === task.toLowerCase() && t.date === taskDate)) return false;

    tasks.push({ name: task, done: false, date: taskDate });
    updateTaskList();
    if (taskDate) {
        highlightCalendarDate(taskDate);
    }
    saveToLocalStorage();

    taskInput.value = '';
    taskDateInput.value = '';
    return false;
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    saveToLocalStorage();
    initializeCalendar(new Date().getFullYear(), new Date().getMonth()); // Re-initialize calendar to remove highlight if needed
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = taskList.insertRow();
        row.innerHTML = `
            <td>${task.name}${task.date ? ' - ' + task.date : ''}</td>
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

function initializeCalendar(year, month) {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const currentMonth = new Date(year, month);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Affichage des boutons de navigation
    const header = document.createElement('div');
    header.className = 'calendar-header';
    const prevButton = document.createElement('button');
    prevButton.textContent = '<';
    prevButton.onclick = () => initializeCalendar(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);

    const nextButton = document.createElement('button');
    nextButton.textContent = '>';
    nextButton.onclick = () => initializeCalendar(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

    const monthYear = document.createElement('span');
    monthYear.textContent = currentMonth.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    header.appendChild(prevButton);
    header.appendChild(monthYear);
    header.appendChild(nextButton);
    calendar.appendChild(header);

    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.className = 'calendar-day-header';
        calendar.appendChild(dayElement);
    });

    const firstDay = new Date(year, month, 1).getDay();
    const paddingDays = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < paddingDays; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        dayElement.textContent = i;
        dayElement.classList.add('calendar-day');
        dayElement.dataset.date = date;

        calendar.appendChild(dayElement);
    }

    highlightAllTaskDates();
}

function highlightCalendarDate(date) {
    const calendarDayElements = document.querySelectorAll('.calendar-day');
    calendarDayElements.forEach(day => {
        if (day.dataset.date === date) {
            day.style.backgroundColor = '#ddd'; // Couleur de surbrillance pour les dates avec tâches
        }
    });
}

function highlightAllTaskDates() {
    tasks.forEach(task => {
        if (task.date) {
            highlightCalendarDate(task.date);
        }
    });
}

function formatDate(dateString) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
    initializeCalendar(new Date().getFullYear(), new Date().getMonth());
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
