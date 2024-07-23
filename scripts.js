var habits = [];
var habitHistory = {}; // Object to store the history of habits
var habitChart;

loadFromLocalStorage();

function addHabit() {
    event.preventDefault();

    var habit = document.getElementById('habit').value.trim();
    if (habit === '') return false;

    habits.push({ name: habit, done: false });
    updateHabitList();
    updateHabitChart();
    saveToLocalStorage();

    document.getElementById('habit').value = '';
    return false;
}

function deleteHabit(index) {
    habits.splice(index, 1);
    updateHabitList();
    updateHabitChart();
    saveToLocalStorage();
}

function updateHabitList() {
    var habitList = document.getElementById('habit-list');
    habitList.innerHTML = '';

    habits.forEach(function(habit, index) {
        var row = habitList.insertRow();
        row.innerHTML = `
            <td>${habit.name}</td>
            <td><input type="checkbox" onchange="toggleHabit(${index}, this)" ${habit.done ? 'checked' : ''}>
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

    var habitList = document.getElementById('habit-list');
    var rows = habitList.getElementsByTagName('tr');
    rows[index].classList.toggle('habit-done-today', habits[index].done);
}

function updateHabitChart() {
    var today = new Date();
    var day = ('0' + today.getDate()).slice(-2);
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var year = today.getFullYear();
    var formattedDate = `${day}/${month}/${year}`;

    // Mettre à jour seulement le point d'aujourd'hui
    habitHistory[formattedDate] = habits.filter(habit => habit.done).length;

    var dates = Object.keys(habitHistory).sort(function(a, b) {
        var aParts = a.split('/');
        var bParts = b.split('/');
        var aDate = new Date(aParts[2], aParts[1] - 1, aParts[0]);
        var bDate = new Date(bParts[2], bParts[1] - 1, bParts[0]);
        return aDate - bDate;
    });
    var totalHabits = habits.length;
    var percentages = dates.map(date => {
        if (totalHabits === 0) {
            return 0;
        }
        return (habitHistory[date] / totalHabits) * 100;
    });

    if (habitChart) {
        habitChart.destroy();
    }

    var ctx = document.getElementById('habit-chart').getContext('2d');
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
    var storedHabits = localStorage.getItem('habits');
    var storedHabitHistory = localStorage.getItem('habitHistory');
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
    saveToLocalStorage();
    updateHabitChart();
}
