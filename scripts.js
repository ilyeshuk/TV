let habits = [];
let habitHistory = {};
let habitChart;

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.querySelector('.habit-form').addEventListener('submit', addHabit);
});

const translations = {
    fr: {
        title: "Suivi des Habitudes",
        motivationText: "Motivez-vous pour atteindre vos objectifs. En suivant vos habitudes régulièrement, vous renforcez votre détermination et augmentez vos chances de succès.",
        habitLabel: "Habitude :",
        addButtonText: "Ajouter",
        habitColumn: "Habitude",
        doneColumn: "Fait aujourd'hui",
        darkModeButtonText: "Activer le mode sombre",
        resetButtonText: "Réinitialiser les données"
    },
    en: {
        title: "Habit Tracker",
        motivationText: "Motivate yourself to achieve your goals. By regularly tracking your habits, you strengthen your determination and increase your chances of success.",
        habitLabel: "Habit:",
        addButtonText: "Add",
        habitColumn: "Habit",
        doneColumn: "Done Today",
        darkModeButtonText: "Activate Dark Mode",
        resetButtonText: "Reset Data"
    },
    es: {
        title: "Seguimiento de Hábitos",
        motivationText: "Motívate para alcanzar tus objetivos. Al seguir tus hábitos regularmente, refuerzas tu determinación y aumentas tus posibilidades de éxito.",
        habitLabel: "Hábito:",
        addButtonText: "Agregar",
        habitColumn: "Hábito",
        doneColumn: "Hecho Hoy",
        darkModeButtonText: "Activar Modo Oscuro",
        resetButtonText: "Restablecer Datos"
    },
    zh: {
        title: "习惯追踪",
        motivationText: "激励自己实现目标。通过定期跟踪您的习惯，您会增强决心并增加成功的机会。",
        habitLabel: "习惯：",
        addButtonText: "添加",
        habitColumn: "习惯",
        doneColumn: "今天完成",
        darkModeButtonText: "启用黑暗模式",
        resetButtonText: "重置数据"
    },
    ar: {
        title: "تتبع العادات",
        motivationText: "حفز نفسك لتحقيق أهدافك. من خلال متابعة عاداتك بانتظام، تقوي عزيمتك وتزيد من فرص نجاحك.",
        habitLabel: "عادة:",
        addButtonText: "أضف",
        habitColumn: "عادة",
        doneColumn: "تم اليوم",
        darkModeButtonText: "تفعيل الوضع الداكن",
        resetButtonText: "إعادة تعيين البيانات"
    },
    hi: {
        title: "आदत ट्रैकर",
        motivationText: "अपने लक्ष्यों को प्राप्त करने के लिए खुद को प्रेरित करें। नियमित रूप से अपनी आदतों को ट्रैक करके, आप अपने दृढ़ संकल्प को मजबूत करते हैं और अपनी सफलता की संभावना बढ़ाते हैं।",
        habitLabel: "आदत:",
        addButtonText: "जोड़ें",
        habitColumn: "आदत",
        doneColumn: "आज किया गया",
        darkModeButtonText: "डार्क मोड सक्रिय करें",
        resetButtonText: "डेटा रीसेट करें"
    },
    pt: {
        title: "Rastreador de Hábitos",
        motivationText: "Motiva-te a alcançar os teus objetivos. Ao acompanhar regularmente os teus hábitos, fortaleces a tua determinação e aumentas as tuas chances de sucesso.",
        habitLabel: "Hábito:",
        addButtonText: "Adicionar",
        habitColumn: "Hábito",
        doneColumn: "Feito Hoje",
        darkModeButtonText: "Ativar Modo Escuro",
        resetButtonText: "Redefinir Dados"
    },
    bn: {
        title: "অভ্যাস ট্র্যাকার",
        motivationText: "আপনার লক্ষ্য অর্জনের জন্য নিজেকে অনুপ্রাণিত করুন। আপনার অভ্যাসগুলি নিয়মিতভাবে ট্র্যাক করার মাধ্যমে, আপনি আপনার সংকল্পকে শক্তিশালী করেন এবং আপনার সাফল্যের সম্ভাবনাকে বাড়ান।",
        habitLabel: "অভ্যাস:",
        addButtonText: "যোগ করুন",
        habitColumn: "অভ্যাস",
        doneColumn: "আজ সম্পন্ন",
        darkModeButtonText: "ডার্ক মোড সক্রিয় করুন",
        resetButtonText: "ডেটা রিসেট করুন"
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
}

function addHabit(event) {
    event.preventDefault();

    const habitInput = document.getElementById('habit');
    const habit = habitInput.value.trim();
    if (habit === '') return false;

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
    habitChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Pourcentage d\'habitudes faites',
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
    updateHabitChart();
}
