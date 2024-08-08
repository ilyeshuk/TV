let tasks = [];
let taskHistory = {};

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage(); // Charger les tâches à partir du stockage local
    updateTaskList(); // Mettre à jour la liste des tâches affichée
    initializeCalendar(new Date().getFullYear(), new Date().getMonth()); // Initialiser le calendrier pour le mois courant
    document.querySelector('.task-form').addEventListener('submit', addTask); // Ajouter un écouteur d'événement pour l'ajout de tâches
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
        calendarLabel: "Pourcentage de Tâches Réalisées"
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
        calendarLabel: "Percentage of Tasks Completed"
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
}

function addTask(event) {
    event.preventDefault(); // Empêcher le rechargement de la page lors de la soumission du formulaire

    const taskInput = document.getElementById('task'); // Récupérer la valeur du champ de texte de la tâche
    const taskDateInput = document.getElementById('task-date'); // Récupérer la date sélectionnée
    const task = taskInput.value.trim(); // Enlever les espaces inutiles dans le nom de la tâche
    const taskDate = taskDateInput.value ? formatDateForStorage(taskDateInput.value) : ''; // Formater la date pour le stockage et la surbrillance

    // Vérifier si la tâche est vide ou si une tâche identique existe déjà à la même date
    if (task === '' || tasks.some(t => t.name.toLowerCase() === task.toLowerCase() && t.date === taskDate)) return false;

    // Ajouter la nouvelle tâche à la liste des tâches
    tasks.push({ name: task, done: false, date: taskDate });
    updateTaskList(); // Mettre à jour l'affichage de la liste des tâches
    if (taskDate) {
        highlightCalendarDate(taskDate); // Surligner la date dans le calendrier si une date est sélectionnée
    }
    saveToLocalStorage(); // Sauvegarder la tâche dans le stockage local

    // Réinitialiser les champs de saisie
    taskInput.value = '';
    taskDateInput.value = '';
    return false;
}

function deleteTask(index) {
    tasks.splice(index, 1); // Supprimer la tâche de la liste
    updateTaskList(); // Mettre à jour l'affichage de la liste des tâches
    saveToLocalStorage(); // Sauvegarder les modifications dans le stockage local
    initializeCalendar(new Date().getFullYear(), new Date().getMonth()); // Réinitialiser le calendrier pour refléter les changements
}

function updateTaskList() {
    const taskList = document.getElementById('task-list'); // Récupérer l'élément DOM qui contient la liste des tâches
    taskList.innerHTML = ''; // Réinitialiser le contenu de la liste des tâches

    // Boucle pour ajouter chaque tâche à la liste des tâches affichée
    tasks.forEach((task, index) => {
        const row = taskList.insertRow(); // Créer une nouvelle ligne pour la tâche
        row.innerHTML = `
            <td>${task.name}${task.date ? ' - ' + formatDateForDisplay(task.date) : ''}</td> 
            <td>
                <input type="checkbox" onchange="toggleTask(${index}, this)" ${task.done ? 'checked' : ''}>
                <button class="delete-button" onclick="deleteTask(${index})"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        if (task.done) {
            row.classList.add('task-done-today'); // Appliquer un style différent si la tâche est marquée comme faite
        }
    });
}

function toggleTask(index, checkbox) {
    tasks[index].done = checkbox.checked; // Mettre à jour l'état "fait" de la tâche
    updateTaskList(); // Mettre à jour l'affichage de la liste des tâches
    saveToLocalStorage(); // Sauvegarder les modifications dans le stockage local

    // Appliquer ou retirer la classe 'task-done-today' pour indiquer si la tâche est faite
    const taskList = document.getElementById('task-list');
    const rows = taskList.getElementsByTagName('tr');
    rows[index].classList.toggle('task-done-today', tasks[index].done);
}

function initializeCalendar(year, month) {
    const calendar = document.getElementById('calendar'); // Récupérer l'élément DOM du calendrier
    calendar.innerHTML = ''; // Vider le contenu actuel du calendrier

    const currentMonth = new Date(year, month); // Créer une date pour le mois actuel
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Calculer le nombre de jours dans le mois

    // Créer l'en-tête du calendrier avec les boutons de navigation
    const header = document.createElement('div');
    header.className = 'calendar-header';
    const prevButton = document.createElement('button');
    prevButton.textContent = '<';
    prevButton.onclick = () => initializeCalendar(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);

    const nextButton = document.createElement('button');
    nextButton.textContent = '>';
    nextButton.onclick = () => initializeCalendar(month === 11 ? year + 1 : year, month === 11 ? 0 : month + 1);

    const monthYear = document.createElement('span');
    monthYear.textContent = `${String(month + 1).padStart(2, '0')}/${year}`; // Afficher le mois et l'année en format numérique

    header.appendChild(prevButton);
    header.appendChild(monthYear);
    header.appendChild(nextButton);
    calendar.appendChild(header);

    // Créer un tableau pour le calendrier
    const table = document.createElement('table');
    table.className = 'calendar-table';
    calendar.appendChild(table);

    // Ajouter les jours de la semaine en en-tête
    const thead = document.createElement('thead');
    table.appendChild(thead);
    const headerRow = document.createElement('tr');
    thead.appendChild(headerRow);
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    daysOfWeek.forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });

    // Créer le corps du tableau
    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // Ajouter des cases vides pour aligner le premier jour du mois correctement
    const firstDay = new Date(year, month, 1).getDay();
    const paddingDays = firstDay === 0 ? 6 : firstDay - 1;
    let row = document.createElement('tr');
    tbody.appendChild(row);

    for (let i = 0; i < paddingDays; i++) {
        const emptyCell = document.createElement('td');
        emptyCell.classList.add('calendar-day', 'empty-before');
        row.appendChild(emptyCell);
    }

    // Ajouter les jours du mois
    for (let i = 1; i <= daysInMonth; i++) {
        if (row.children.length === 7) {
            row = document.createElement('tr');
            tbody.appendChild(row);
        }

        const dayElement = document.createElement('td');
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        dayElement.textContent = i;
        dayElement.classList.add('calendar-day');
        dayElement.dataset.date = date;

        // Ajouter un événement pour modifier ou supprimer une tâche en cliquant sur un jour
        dayElement.addEventListener('click', () => {
            const tasksForThisDay = tasks.filter(task => task.date === date);
            if (tasksForThisDay.length > 0) {
                let taskOptions = tasksForThisDay.map((task, index) => `${index + 1}: ${task.name}`).join('\n');
                let choice = prompt(`Tâches pour le ${formatDateForDisplay(date)}:\n${taskOptions}\n\nEntrez le numéro de la tâche pour la modifier ou supprimer`, '1');
                let taskIndex = parseInt(choice) - 1;
                if (!isNaN(taskIndex) && taskIndex >= 0 && taskIndex < tasksForThisDay.length) {
                    let action = confirm("Cliquez sur OK pour supprimer la tâche ou sur Annuler pour la modifier");
                    if (action) {
                        deleteTask(tasks.indexOf(tasksForThisDay[taskIndex])); // Supprimer la tâche
                    } else {
                        let newTaskName = prompt("Entrez le nouveau nom de la tâche", tasksForThisDay[taskIndex].name);
                        if (newTaskName.trim() !== "") {
                            tasks[tasks.indexOf(tasksForThisDay[taskIndex])].name = newTaskName.trim(); // Modifier la tâche
                            updateTaskList(); // Mettre à jour la liste des tâches
                            saveToLocalStorage(); // Sauvegarder les modifications
                        }
                    }
                }
            } else {
                alert(`Aucune tâche pour le ${formatDateForDisplay(date)}`);
            }
        });

        row.appendChild(dayElement);
    }
    
    // Ajouter des cases vides après le dernier jour du mois
    const remainingDays = 7 - ((daysInMonth + paddingDays) % 7);
    for (let i = 0; i < remainingDays && remainingDays < 7; i++) {
        const emptyCell = document.createElement('td');
        emptyCell.classList.add('calendar-day', 'empty');
        row.appendChild(emptyCell);
    }

    highlightAllTaskDates(); // Surligner les jours qui ont des tâches associées
}

// Fonction pour surligner une date dans le calendrier si elle est associée à une tâche
function highlightCalendarDate(date) {
    const calendarDayElements = document.querySelectorAll('.calendar-day');
    calendarDayElements.forEach(day => {
        if (day.dataset.date === date) {
            day.style.backgroundColor = '#ddd'; // Appliquer la couleur de surbrillance
        }
    });
}

// Fonction pour surligner toutes les dates qui ont des tâches associées
function highlightAllTaskDates() {
    tasks.forEach(task => {
        if (task.date) {
            highlightCalendarDate(task.date);
        }
    });
}

// Fonction pour formater une date au format "jj/mm/aaaa" pour affichage
function formatDateForDisplay(dateString) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Fonction pour formater une date pour le stockage et les comparaisons
function formatDateForStorage(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${year}-${month}-${day}`;
}

// Fonction pour basculer entre le mode clair et le mode sombre
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Fonction pour sauvegarder les tâches dans le stockage local
function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Fonction pour charger les tâches à partir du stockage local
function loadFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// Fonction pour réinitialiser les données en supprimant toutes les tâches
function resetData() {
    tasks = [];
    saveToLocalStorage(); // Sauvegarder les modifications dans le stockage local
    updateTaskList(); // Mettre à jour l'affichage de la liste des tâches
    initializeCalendar(new Date().getFullYear(), new Date().getMonth()); // Réinitialiser le calendrier
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
