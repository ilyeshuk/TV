let habits = [];
let habitHistory = {};
let habitChart;

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    document.querySelector('.habit-form').addEventListener('submit', addHabit);
});

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
}

function updateHabitChart() {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    habitHistory[formattedDate] = habits.filter(habit => habit.done).length;

    const dates = Object.keys(habitHistory).sort((a, b) => {
        const [aDay, aMonth, aYear] = a.split('/').map(Number);
        const [bDay, bMonth, bYear] = b.split('/').map(Number);
        return new Date(aYear, aMonth - 1, aDay) - new Date(bYear, bMonth - 1, bDay);
    });
    const totalHabits = habits.length;
    const percentages = dates.map(date => (totalHabits === 0 ? 0 : (habitHistory[date] / totalHabits) * 100));

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
                        callback: value => `${value}%`
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
    saveToLocalStorage();
    updateHabitChart();
}
