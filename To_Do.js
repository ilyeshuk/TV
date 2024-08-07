let tasks = [];
let calendar;

const translations = {
    fr: {
        title: "Gestion des Tâches",
        motivationText: "Restez concentré sur vos objectifs en suivant vos tâches régulièrement. Cela renforce votre motivation et augmente vos chances de réussite.",
        taskLabel: "Tâche :",
        addButtonText: "Ajouter",
        taskColumn: "Tâche",
        doneColumn: "Fait Aujourd'hui",
        darkModeButtonText: "Activer le Mode Sombre",
        resetButtonText: "Réinitialiser les Données",
    },
    en: {
        title: "Task Manager",
        motivationText: "Stay focused on your goals by regularly tracking your tasks. This boosts your motivation and increases your chances of success.",
        taskLabel: "Task:",
        addButtonText: "Add",
        taskColumn: "Task",
        doneColumn: "Done Today",
        darkModeButtonText: "Activate Dark Mode",
        resetButtonText: "Reset Data",
    },
    // ... autres langues
};

function translatePage(language) {
    const translation = translations[language];
    document.getElementById('title').innerText = translation.title;
    document.getElementById('motivation-text').innerText = translation.motivationText;
    document.getElementById('task-label').innerText = translation.taskLabel;
    document.getElementById('add-button-text').innerText = translation.addButtonText;
    document.getElementById('task-column').innerText = translation.taskColumn;
    document.getElementById('done-column').innerText = translation.doneColumn;
    document.getElementById('dark-mode-button-text').innerText = translation.darkModeButtonText;
    document.getElementById('reset-button-text').innerText = translation.resetButtonText;
}

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.querySelector('.task-form').addEventListener('submit', addTask);
    initCalendar();
});

function addTask(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task');
    const task = taskInput.value.trim();
    if (task === '' || tasks.some(t => t.name.toLowerCase() === task.toLowerCase())) return;

    tasks.push({ name: task, done: false });
    updateTaskList();
    updateCalendar();
    saveToLocalStorage();
    taskInput.value = '';
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    updateCalendar();
    saveToLocalStorage();
}

function updateTaskList() {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const row = taskList.insertRow();
        row.innerHTML = `
            <td>${task.name}</td>
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
    updateCalendar();
    saveToLocalStorage();
}

function initCalendar() {
    calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
        initialView: 'dayGridMonth',
        editable: true,
        events: getCalendarEvents(),
        eventClick: function(info) {
            alert('Task: ' + info.event.title);
        }
    });
    calendar.render();
}

function updateCalendar() {
    const events = getCalendarEvents();
    calendar.removeAllEvents();
    calendar.addEventSource(events);
}

function getCalendarEvents() {
    return tasks.map(task => ({
        title: task.name,
        start: new Date().toISOString().split('T')[0]  // Date actuelle pour l'exemple
    }));
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
    updateTaskList();
    if (calendar) {
        updateCalendar();  // Assure-toi que calendar est défini
    }
}


function resetData() {
    tasks = [];
    saveToLocalStorage();
    updateTaskList();
    updateCalendar();
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
