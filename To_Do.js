document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.querySelector(".task-form");
    const taskInput = document.getElementById("task");
    const taskList = document.getElementById("task-list");
    const calendarEl = document.getElementById("calendar");

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        selectable: true,
        select: function(info) {
            const taskText = prompt("Enter task for " + info.startStr);
            if (taskText) {
                addTaskToCalendar(taskText, info.startStr);
            }
            calendar.unselect();
        }
    });
    calendar.render();

    function addTask(event) {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText !== "") {
            addTaskToCalendar(taskText, new Date().toISOString().split('T')[0]);
            taskInput.value = "";
        }
    }

    function addTaskToCalendar(task, date) {
        calendar.addEvent({
            title: task,
            start: date,
            allDay: true
        });
        saveTasks();
    }

    function saveTasks() {
        const events = calendar.getEvents();
        const tasks = events.map(event => ({
            title: event.title,
            start: event.startStr
        }));
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => {
            calendar.addEvent({
                title: task.title,
                start: task.start,
                allDay: true
            });
        });
    }

    function toggleDarkMode() {
        document.body.classList.toggle("dark-mode");
        const darkModeText = document.body.classList.contains("dark-mode") ? "Désactiver le mode sombre" : "Activer le mode sombre";
        document.querySelector(".toggle-dark-mode-button span").textContent = darkModeText;
    }

    function resetData() {
        if (confirm("Are you sure you want to reset all data?")) {
            localStorage.removeItem("tasks");
            calendar.getEvents().forEach(event => event.remove());
        }
    }

    loadTasks();

    taskForm.addEventListener("submit", addTask);
    document.querySelector(".toggle-dark-mode-button").addEventListener("click", toggleDarkMode);
    document.querySelector(".reset-data-button").addEventListener("click", resetData);
});

function translatePage(lang) {
    const translations = {
        fr: {
            title: "Gestion des tâches",
            motivationText: "Restez concentré sur vos objectifs en suivant vos tâches régulièrement. Cela renforce votre motivation et augmente vos chances de réussite.",
            taskLabel: "Tâche :",
            addButtonText: "Ajouter",
            taskColumn: "Tâche",
            doneColumn: "Fait aujourd'hui",
            darkModeButtonText: "Activer le mode sombre",
            resetButtonText: "Réinitialiser les données"
        },
        en: {
            title: "Task Management",
            motivationText: "Stay focused on your goals by tracking your tasks regularly. This strengthens your motivation and increases your chances of success.",
            taskLabel: "Task:",
            addButtonText: "Add",
            taskColumn: "Task",
            doneColumn: "Done Today",
            darkModeButtonText: "Enable Dark Mode",
            resetButtonText: "Reset Data"
        },
        es: {
            title: "Gestión de Tareas",
            motivationText: "Mantente enfocado en tus objetivos haciendo un seguimiento regular de tus tareas. Esto refuerza tu motivación y aumenta tus posibilidades de éxito.",
            taskLabel: "Tarea:",
            addButtonText: "Agregar",
            taskColumn: "Tarea",
            doneColumn: "Hecho hoy",
            darkModeButtonText: "Activar modo oscuro",
            resetButtonText: "Restablecer datos"
        }
        // Add other languages here...
    };

    const translation = translations[lang];
    if (translation) {
        document.getElementById("title").textContent = translation.title;
        document.getElementById("motivation-text").textContent = translation.motivationText;
        document.getElementById("task-label").textContent = translation.taskLabel;
        document.getElementById("add-button-text").textContent = translation.addButtonText;
        document.getElementById("task-column").textContent = translation.taskColumn;
        document.getElementById("done-column").textContent = translation.doneColumn;
        document.getElementById("dark-mode-button-text").textContent = translation.darkModeButtonText;
        document.getElementById("reset-button-text").textContent = translation.resetButtonText;
    }
}
