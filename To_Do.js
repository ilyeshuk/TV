let habits = [];
let habitHistory = {};
let habitChart;

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.querySelector('.habit-form').addEventListener('submit', addHabit);
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
    document.getElementById('habit-label').innerText = translation.habitLabel;
    document.getElementById('add-button-text').innerText = translation.addButtonText;
    document.getElementById('habit-column').innerText = translation.habitColumn;
    document.getElementById('done-column').innerText = translation.doneColumn;
    document.getElementById('dark-mode-button-text').innerText = translation.darkModeButtonText;
    document.getElementById('reset-button-text').innerText = translation.resetButtonText;
    if (habitChart) {
        habitChart.data.datasets[0].label = translation.chartLabel;
        habitChart.update();
    }
}

function addHabit(event) {
    event.preventDefault();

    const habitInput = document.getElementById('habit');
    const habit = habitInput.value.trim();
    if (habit === '' || habits.some(h => h.name.toLowerCase() === habit.toLowerCase())) return false;

    habits.push({ name: habit, done: false });
    updateHabitList();
    updateHabitChart();
    saveToLocalStorage();

    habitInput.value = '';
    return false;
}

function deleteHabit(index) {
    habits.splice(index, 1);
    updateHabitList();
    updateHabitChart();
    saveToLocalStorage();
}

function updateHabitList() {
    const habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';

    habits.forEach((habit, index) => {
        const row = habitList.insertRow();
        row.innerHTML = `
            <td>${habit.name}</td>
            <td>
                <input type="checkbox" onchange="toggleHabit(${index}, this)" ${habit.done ? 'checked' : ''}>
                <button class="delete-button" onclick="deleteHabit(${index})"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        if (habit.done) {
            row.classList.add('habit-done-today');
        }
    });
}

function toggleHabit(index, checkbox) {
    habits[index].done = checkbox.checked;
    updateHabitList();
    updateHabitChart();
    saveToLocalStorage();

    const habitList = document.getElementById('habit-list');
    const rows = habitList.getElementsByTagName('tr');
    rows[index].classList.toggle('habit-done-today', habits[index].done);
}

function updateHabitChart() {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    habitHistory[formattedDate] = habits.filter(habit => habit.done).length;

    const dates = Object.keys(habitHistory).sort((a, b) => {
        const aParts = a.split('/');
        const bParts = b.split('/');
        const aDate = new Date(aParts[2], aParts[1] - 1, aParts[0]);
        const bDate = new Date(bParts[2], bParts[1] - 1, bParts[0]);
        return aDate - bDate;
    });
    const totalHabits = habits.length;
    const percentages = dates.map(date => totalHabits === 0 ? 0 : (habitHistory[date] / totalHabits) * 100);

    if (habitChart) {
        habitChart.destroy();
    }

    const ctx = document.getElementById('habit-chart').getContext('2d');
    const currentLanguage = document.documentElement.lang || 'en';
    habitChart = new Chart(ctx, {
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
    updateHabitChart();
}

function saveToLocalStorage() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('habitHistory', JSON.stringify(habitHistory));
}

function loadFromLocalStorage() {
    const storedHabits = localStorage.getItem('habits');
    const storedHabitHistory = localStorage.getItem('habitHistory');
    if (storedHabits) {
        habits = JSON.parse(storedHabits);
    }
    if (storedHabitHistory) {
        habitHistory = JSON.parse(storedHabitHistory);
    }
    updateHabitList();
    updateHabitChart();
}

function resetData() {
    habitHistory = {};
    habits = [];
    saveToLocalStorage();
    updateHabitList();
    updateHabitChart();
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
