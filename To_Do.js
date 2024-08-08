let tasks = [];
let taskHistory = {};

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage(); // Charger les tâches à partir du stockage local
    updateTaskList(); // Mettre à jour la liste des tâches affichée
    initializeCalendar(new Date().getFullYear(), new Date().getMonth()); // Initialiser le calendrier pour le mois courant
    document.querySelector('.task-form').addEventListener('submit', addTask); // Ajouter un écouteur d'événement pour l'ajout de tâches
});

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

    // Ajouter les jours de la semaine en en-tête
    const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    daysOfWeek.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.className = 'calendar-day-header';
        dayElement.style.border = '1px solid #ccc'; // Ajouter des bordures pour séparer les jours
        calendar.appendChild(dayElement);
    });

    // Ajouter des cases vides pour aligner le premier jour du mois correctement
    const firstDay = new Date(year, month, 1).getDay();
    const paddingDays = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < paddingDays; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        emptyDay.style.border = '1px solid #ccc'; // Ajouter des bordures pour séparer les cases vides
        calendar.appendChild(emptyDay);
    }

    // Créer les jours du mois dans le calendrier
    for (let i = 1; i <= daysInMonth; i++) {
        const dayElement = document.createElement('div');
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        dayElement.textContent = i;
        dayElement.classList.add('calendar-day');
        dayElement.dataset.date = date;
        dayElement.style.border = '1px solid #ccc'; // Ajouter des bordures pour séparer les jours

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

        calendar.appendChild(dayElement);
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
