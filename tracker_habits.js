let habits = [];
let habitHistory = {};
let habitHistoryWithSeconds = {};
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
        resetButtonText: "Réinitialiser les données",
        chartLabel: "Pourcentage d'habitudes faites"
    },
    en: {
        title: "Habit Tracker",
        motivationText: "Motivate yourself to achieve your goals. By regularly tracking your habits, you strengthen your determination and increase your chances of success.",
        habitLabel: "Habit:",
        addButtonText: "Add",
        habitColumn: "Habit",
        doneColumn: "Done Today",
        darkModeButtonText: "Activate Dark Mode",
        resetButtonText: "Reset Data",
        chartLabel: "Percentage of Habits Done"
    },
    es: {
        title: "Seguimiento de Hábitos",
        motivationText: "Motívate para alcanzar tus objetivos. Al seguir tus hábitos regularmente, refuerzas tu determinación y aumentas tus posibilidades de éxito.",
        habitLabel: "Hábito:",
        addButtonText: "Agregar",
        habitColumn: "Hábito",
        doneColumn: "Hecho Hoy",
        darkModeButtonText: "Activar Modo Oscuro",
        resetButtonText: "Restablecer Datos",
        chartLabel: "Porcentaje de Hábitos Realizados"
    },
    zh: {
        title: "习惯追踪",
        motivationText: "激励自己实现目标。通过定期跟踪您的习惯，您会增强决心并增加成功的机会。",
        habitLabel: "习惯：",
        addButtonText: "添加",
        habitColumn: "习惯",
        doneColumn: "今天完成",
        darkModeButtonText: "启用黑暗模式",
        resetButtonText: "重置数据",
        chartLabel: "完成习惯的百分比"
    },
    ar: {
        title: "تتبع العادات",
        motivationText: "حفز نفسك لتحقيق أهدافك. من خلال متابعة عاداتك بانتظام، تقوي عزيمتك وتزيد من فرص نجاحك.",
        habitLabel: "عادة:",
        addButtonText: "أضف",
        habitColumn: "عادة",
        doneColumn: "تم اليوم",
        darkModeButtonText: "تفعيل الوضع الداكن",
        resetButtonText: "إعادة تعيين البيانات",
        chartLabel: "نسبة العادات المنجزة"
    },
    hi: {
        title: "आदत ट्रैकर",
        motivationText: "अपने लक्ष्यों को प्राप्त करने के लिए खुद को प्रेरित करें। नियमित रूप से अपनी आदतों को ट्रैक करके, आप अपने दृढ़ संकल्प को मजबूत करते हैं और अपनी सफलता की संभावना बढ़ाते हैं।",
        habitLabel: "आदत:",
        addButtonText: "जोड़ें",
        habitColumn: "आदत",
        doneColumn: "आज किया गया",
        darkModeButtonText: "डार्क मोड सक्रिय करें",
        resetButtonText: "डेटा रीसेट करें",
        chartLabel: "पूरी की गई आदतों का प्रतिशत"
    },
    pt: {
        title: "Rastreador de Hábitos",
        motivationText: "Motiva-te a alcançar os teus objetivos. Ao acompanhar regularmente os teus hábitos, fortaleces a tua determinação e aumentas as tuas chances de sucesso.",
        habitLabel: "Hábito:",
        addButtonText: "Adicionar",
        habitColumn: "Hábito",
        doneColumn: "Feito Hoje",
        darkModeButtonText: "Ativar Modo Escuro",
        resetButtonText: "Redefinir Dados",
        chartLabel: "Porcentagem de Hábitos Realizados"
    },
    bn: {
        title: "অভ্যাস ট্র্যাকার",
        motivationText: "আপনার লক্ষ্য অর্জনের জন্য নিজেকে অনুপ্রাণিত করুন। আপনার অভ্যাসগুলি নিয়মিতভাবে ট্র্যাক করার মাধ্যমে, আপনি আপনার সংকল্পকে শক্তিশালী করেন এবং আপনার সাফল্যের সম্ভাবনাকে বাড়ান।",
        habitLabel: "অভ্যাস:",
        addButtonText: "যোগ করুন",
        habitColumn: "অভ্যাস",
        doneColumn: "আজ সম্পন্ন",
        darkModeButtonText: "ডার্ক মোড সক্রিয় করুন",
        resetButtonText: "ডেটা রিসেট করুন",
        chartLabel: "সম্পন্ন অভ্যাসের শতাংশ"
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

function updateHabitHistoryWithSeconds() {
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const hours = ('0' + today.getHours()).slice(-2);
    const minutes = ('0' + today.getMinutes()).slice(-2);
    const seconds = ('0' + today.getSeconds()).slice(-2);

    const formattedDateWithSeconds = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    // Calculer le nombre d'habitudes complétées aujourd'hui
    const completedHabitsToday = habits.filter(habit => habit.done).length;

    // Mettre à jour habitHistoryWithSeconds avec la date et l'heure actuelles
    habitHistoryWithSeconds[formattedDateWithSeconds] = completedHabitsToday;

    // Sauvegarder habitHistoryWithSeconds dans le localStorage
    localStorage.setItem('habitHistoryWithSeconds', JSON.stringify(habitHistoryWithSeconds));

    console.log(`Mise à jour à ${formattedDateWithSeconds}: ${completedHabitsToday} habitudes complétées.`);
}

// Appel de la fonction pour mettre à jour habitHistoryWithSeconds à chaque seconde
setInterval(updateHabitHistoryWithSeconds, 1000);

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateHabitChart();
}

function saveToLocalStorage() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('habitHistory', JSON.stringify(habitHistory));
    localStorage.setItem('habitHistoryWithSeconds', JSON.stringify(habitHistoryWithSeconds)); 
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
    if (storedHabitHistoryWithSeconds) { 
        habitHistoryWithSeconds = JSON.parse(storedHabitHistoryWithSeconds); 
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

var quotes = [
        "Le succès n'est pas la clé du bonheur. Le bonheur est la clé du succès. Si vous aimez ce que vous faites, vous réussirez. - Albert Schweitzer",
        "N'abandonnez jamais un rêve juste à cause du temps qu'il faudra pour l'accomplir. Le temps passera de toute façon. - Earl Nightingale",
        "Vous êtes plus courageux que vous ne le croyez, plus fort que vous ne le semblez, et plus intelligent que vous ne le pensez. - A.A. Milne",
        "La seule limite à notre épanouissement de demain sera nos doutes d'aujourd'hui. - Franklin D. Roosevelt",
        "La meilleure façon de prédire l'avenir est de le créer. - Peter Drucker",
        "Le seul endroit où le succès vient avant le travail est dans le dictionnaire. - Vidal Sassoon",
        "Ne regarde pas l'escalier tout entier. Commence juste par la première marche. - Martin Luther King Jr.",
        "Le bonheur est un choix que vous pouvez faire à tout moment et en tout lieu. - Steve Maraboli",
        "Vous ne trouvez jamais le bonheur en vous comparant aux autres. - Roy T. Bennett",
        "La vie est ce qui arrive quand vous êtes occupé à faire d'autres plans. - John Lennon",
        "Ne comptez pas les jours, faites que les jours comptent. - Muhammad Ali",
        "Le succès consiste à aller d'échec en échec sans perdre son enthousiasme. - Winston Churchill",
        "Il n'y a qu'une façon d'éviter les critiques : ne rien faire, ne rien dire et n'être rien. - Aristote",
        "L'échec est l'épice qui donne sa saveur au succès. - Truman Capote",
        "L'obstacle est le chemin. - Proverbe zen",
        "La plus grande gloire n'est pas de ne jamais tomber, mais de se relever à chaque chute. - Confucius",
        "Le bonheur n'est pas quelque chose de prêt à l'emploi. Il vient de vos propres actions. - Dalai Lama",
        "La vie est courte, le monde est vaste. Plus vous tardez à commencer, moins il vous reste de temps pour profiter de l'aventure. - Anonyme",
        "Les grandes choses ne sont jamais faites par une seule personne. Elles sont faites par une équipe de personnes. - Steve Jobs",
        "L'avenir appartient à ceux qui croient en la beauté de leurs rêves. - Eleanor Roosevelt",
        "Ce que l'esprit peut concevoir et croire, il peut le réaliser. - Napoleon Hill",
        "Les opportunités ne se présentent pas. Vous les créez. - Chris Grosser",
        "Votre temps est limité, ne le gâchez pas en menant une existence qui n'est pas la vôtre. - Steve Jobs",
        "L'action est la clé fondamentale de tout succès. - Pablo Picasso",
        "La réussite n'est pas finale, l'échec n'est pas fatal : c'est le courage de continuer qui compte. - Winston Churchill",
        "La plus grande récompense de notre travail n'est pas ce que nous en obtenons, mais ce que nous devenons grâce à lui. - John Ruskin",
        "Croyez que vous pouvez et vous êtes à mi-chemin. - Theodore Roosevelt",
        "Le succès est de se coucher chaque soir en sachant que nous avons fait de notre mieux. - John Wooden",
        "Ne rêvez pas de la réussite. Travaillez pour y parvenir. - Estée Lauder",
        "La motivation vous sert de départ. L'habitude vous fait continuer. - Jim Ryun",
        "Ne laissez jamais une mauvaise situation amener le pire de vous. Choisissez de rester positif et soyez fort. - Anonyme",
        "Le plus grand plaisir dans la vie est de réaliser ce que les autres vous pensent incapable de réaliser. - Walter Bagehot",
        "La vraie motivation vient de l'intérieur de vous. Personne d'autre ne peut vous motiver à devenir meilleur. - Anonyme",
        "Les choses que vous faites pour vous-même disparaissent quand vous n'êtes plus là, mais les choses que vous faites pour les autres restent comme votre héritage. - Kalu Ndukwe Kalu",
        "L'inspiration existe, mais elle doit vous trouver en train de travailler. - Pablo Picasso",
        "La seule chose qui se dresse entre vous et votre objectif est la même histoire que vous continuez de vous raconter sur les raisons pour lesquelles vous ne pouvez pas l'atteindre. - Jordan Belfort",
        "Pour réaliser de grandes choses, nous devons non seulement agir, mais aussi rêver; non seulement planifier, mais aussi croire. - Anatole France",
        "Il est temps de vivre la vie que vous vous êtes imaginée. - Henry James",
        "Le futur appartient à ceux qui se lèvent tôt. - Proverbe français",
        "Il n'y a pas de vent favorable pour celui qui ne sait pas où il va. - Sénèque",
        "L'enthousiasme est à la base de tout progrès. Avec lui, il n'y a que des réalisations. Sans lui, il n'y a que des excuses. - Henry Ford",
        "La meilleure façon de commencer est d'arrêter de parler et de commencer à faire. - Walt Disney",
        "La route vers la réussite est toujours en construction. - Lily Tomlin",
        "Les gens qui réussissent ont des habitudes de réussite. - Brian Tracy",
        "Les seules limites à nos réalisations de demain sont nos doutes d'aujourd'hui. - Franklin D. Roosevelt",
        "Ne laissez jamais les petites querelles ruiner de grandes amitiés. - Anonyme",
        "La vie est ce que nous en faisons, elle a toujours été, elle sera toujours. - Grand-mère Moses",
        "Le succès est souvent atteint par ceux qui ne savent pas que l'échec est inévitable. - Coco Chanel"
    ];

    function displayRandomQuote() {
        var quote = quotes[Math.floor(Math.random() * quotes.length)];
        document.getElementById('quote').innerText = quote;
    }

    // Affiche une citation aléatoire à chaque chargement de la page
    displayRandomQuote();

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
