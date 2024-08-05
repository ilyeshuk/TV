let tasks = [];
let taskHistory = {};
let taskChart;

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.querySelector('.task-form').addEventListener('submit', addTask);
});

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
        chartLabel: "Pourcentage de Tâches Réalisées"
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
        chartLabel: "Percentage of Tasks Completed"
    },
    es: {
        title: "Gestor de Tareas",
        motivationText: "Mantente enfocado en tus objetivos al seguir tus tareas regularmente. Esto refuerza tu motivación y aumenta tus posibilidades de éxito.",
        taskLabel: "Tarea:",
        addButtonText: "Agregar",
        taskColumn: "Tarea",
        doneColumn: "Hecho Hoy",
        darkModeButtonText: "Activar Modo Oscuro",
        resetButtonText: "Restablecer Datos",
        chartLabel: "Porcentaje de Tareas Completadas"
    },
    zh: {
        title: "任务管理器",
        motivationText: "通过定期跟踪任务来保持目标进度。这可以提升您的动机并增加成功的机会。",
        taskLabel: "任务：",
        addButtonText: "添加",
        taskColumn: "任务",
        doneColumn: "今天完成",
        darkModeButtonText: "启用黑暗模式",
        resetButtonText: "重置数据",
        chartLabel: "完成任务的百分比"
    },
    ar: {
        title: "مدير المهام",
        motivationText: "ابقَ مركزًا على أهدافك من خلال متابعة مهامك بانتظام. هذا يعزز حافزك ويزيد من فرص نجاحك.",
        taskLabel: "مهمة:",
        addButtonText: "أضف",
        taskColumn: "مهمة",
        doneColumn: "تم اليوم",
        darkModeButtonText: "تفعيل الوضع الداكن",
        resetButtonText: "إعادة تعيين البيانات",
        chartLabel: "نسبة المهام المنجزة"
    },
    hi: {
        title: "कार्य प्रबंधक",
        motivationText: "अपने लक्ष्यों पर केंद्रित रहने के लिए नियमित रूप से अपने कार्यों को ट्रैक करें। इससे आपकी प्रेरणा बढ़ती है और सफलता की संभावनाएं बढ़ती हैं।",
        taskLabel: "कार्य:",
        addButtonText: "जोड़ें",
        taskColumn: "कार्य",
        doneColumn: "आज पूरा किया",
        darkModeButtonText: "डार्क मोड सक्रिय करें",
        resetButtonText: "डेटा रीसेट करें",
        chartLabel: "पूरे किए गए कार्यों का प्रतिशत"
    },
    pt: {
        title: "Gerenciador de Tarefas",
        motivationText: "Mantenha-se focado em seus objetivos ao acompanhar suas tarefas regularmente. Isso aumenta sua motivação e suas chances de sucesso.",
        taskLabel: "Tarefa:",
        addButtonText: "Adicionar",
        taskColumn: "Tarefa",
        doneColumn: "Feito Hoje",
        darkModeButtonText: "Ativar Modo Escuro",
        resetButtonText: "Redefinir Dados",
        chartLabel: "Percentual de Tarefas Concluídas"
    },
    bn: {
        title: "টাস্ক ম্যানেজার",
        motivationText: "নিয়মিতভাবে আপনার কাজগুলি ট্র্যাক করে আপনার লক্ষ্য অর্জনে মনোযোগ দিন। এটি আপনার মোটিভেশন বাড়ায় এবং সাফল্যের সম্ভাবনা বৃদ্ধি করে।",
        taskLabel: "কাজ:",
        addButtonText: "যোগ করুন",
        taskColumn: "কাজ",
        doneColumn: "আজ সম্পন্ন",
        darkModeButtonText: "ডার্ক মোড সক্রিয় করুন",
        resetButtonText: "ডেটা রিসেট করুন",
        chartLabel: "সম্পন্ন কাজের শতাংশ"
    }
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
    if (taskChart) {
        taskChart.data.datasets[0].label = translation.chartLabel;
        taskChart.update();
    }
}

function addTask(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task');
    const task = taskInput.value.trim();
    if (task === '' || tasks.some(t => t.name.toLowerCase() === task.toLowerCase())) return false;

    tasks.push({ name: task, done: false });
    updateTaskList();
    updateTaskChart();
    saveToLocalStorage();

    taskInput.value = '';
    return false;
}

function deleteTask(index) {
    tasks.splice(index, 1);
    updateTaskList();
    updateTaskChart();
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
    updateTaskChart();
    saveToLocalStorage();

    const taskList = document.getElementById('task-list');
    const rows = taskList.getElementsByTagName('tr');
    rows[index].classList.toggle('task-done-today', tasks[index].done);
}

function updateTaskChart() {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    taskHistory[formattedDate] = tasks.filter(task => task.done).length;

    const dates = Object.keys(taskHistory).sort((a, b) => {
        const aParts = a.split('/');
        const bParts = b.split('/');
        const aDate = new Date(aParts[2], aParts[1] - 1, aParts[0]);
        const bDate = new Date(bParts[2], bParts[1] - 1, bParts[0]);
        return aDate - bDate;
    });
    const totalTasks = tasks.length;
    const percentages = dates.map(date => totalTasks === 0 ? 0 : (taskHistory[date] / totalTasks) * 100);

    if (taskChart) {
        taskChart.destroy();
    }

    const ctx = document.getElementById('task-chart').getContext('2d');
    const currentLanguage = document.documentElement.lang || 'en';
    taskChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: translations[currentLanguage].chartLabel,
                data: percentages,
                fill: true,
                backgroundColor: 'rgba(201, 203, 207, 0.2)',
                borderColor: 'rgba(201, 203, 207, 1)',
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: document.body.classList.contains('dark-mode') ? '#fff' : '#333'
                    }
                }
            }
        }
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateTaskChart();
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
}

function loadFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    const storedTaskHistory = localStorage.getItem('taskHistory');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
    if (storedTaskHistory) {
        taskHistory = JSON.parse(storedTaskHistory);
    }
    updateTaskList();
    updateTaskChart();
}

function resetData() {
    taskHistory = {};
    tasks = [];
    saveToLocalStorage();
    updateTaskList();
    updateTaskChart();
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

let calendar;

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.querySelector('.task-form').addEventListener('submit', addTask);
    initCalendar();
});

function initCalendar() {
    const calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: getCalendarEvents(),
        editable: true,
        eventDrop: handleEventDrop,
        eventResize: handleEventResize
    });

    calendar.render();
}

function getCalendarEvents() {
    return tasks.map(task => {
        const eventDates = task.dates || [];
        return eventDates.map(date => ({
            title: task.name,
            start: date.start,
            end: date.end || date.start
        }));
    }).flat();
}

function handleEventDrop(info) {
    const task = tasks.find(t => t.name === info.event.title);
    if (task) {
        task.dates = [{
            start: info.event.startStr,
            end: info.event.endStr
        }];
        saveToLocalStorage();
    }
}

function handleEventResize(info) {
    const task = tasks.find(t => t.name === info.event.title);
    if (task) {
        task.dates = [{
            start: info.event.startStr,
            end: info.event.endStr
        }];
        saveToLocalStorage();
    }
}

function addTask(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task');
    const task = taskInput.value.trim();
    if (task === '' || tasks.some(t => t.name.toLowerCase() === task.toLowerCase())) return false;

    tasks.push({ name: task, done: false, dates: [] });
    updateTaskList();
    updateCalendar();
    saveToLocalStorage();

    taskInput.value = '';
    return false;
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

function updateCalendar() {
    if (calendar) {
        calendar.removeAllEvents();
        calendar.addEventSource(getCalendarEvents());
    }
}
