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
    if (calendar) {
        calendar.data.datasets[0].label = translation.calendar;
        calendar.update();
    }
}

function addTask(event) {
    event.preventDefault();

    const taskInput = document.getElementById('task');
    const task = taskInput.value.trim();
    if (task === '' || tasks.some(t => t.name.toLowerCase() === task.toLowerCase())) return false;

    tasks.push({ name: task, done: false });
    updateTaskList();
    updateCalendar();
    saveToLocalStorage();

    taskInput.value = '';
    return false;
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

    const taskList = document.getElementById('task-list');
    const rows = taskList.getElementsByTagName('tr');
    rows[index].classList.toggle('task-done-today', tasks[index].done);
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
    updateCalendar();
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

