document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'historique des habitudes et les jetons depuis le localStorage
    const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {};
    let money = parseInt(localStorage.getItem('money')) || 0;

    // Calculer le nombre total d'habitudes accomplies aujourd'hui
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    // Vérifier la date du dernier calcul des jetons
    const lastCalculatedDate = localStorage.getItem('lastCalculatedDate');

    if (lastCalculatedDate !== formattedDate) {
        // Vérifier si des habitudes ont été accomplies aujourd'hui
        const completedHabitsToday = habitHistory[formattedDate] || 0;
        console.log(`Habitudes accomplies aujourd'hui: ${completedHabitsToday}`);
        
        if (completedHabitsToday > 0) {
            // Ajouter des pièces seulement si des habitudes ont été complétées
            money += completedHabitsToday * 2;
            console.log(`Nouvelles pièces ajoutées: ${completedHabitsToday * 2}`);
        }
        
        updateMoneyDisplay(money);
        saveMoney(money);
        localStorage.setItem('lastCalculatedDate', formattedDate);
    } else {
        // Afficher l'argent actuel sans ajouter
        updateMoneyDisplay(money);
    }

    // Charger l'état du personnage et les articles achetés
    loadCharacterState();
    loadWardrobe();

    document.querySelectorAll('.shop-item button').forEach(button => {
        button.addEventListener('click', () => {
            buyItem(button, money, (newMoney) => {
                money = newMoney;
                updateMoneyDisplay(money);
                saveMoney(money);
                saveCharacterState();
                loadWardrobe();
            });
        });
    });
});

function updateMoneyDisplay(money) {
    document.getElementById('money').textContent = money;
    document.querySelectorAll('.shop-item button').forEach(button => {
        const price = parseInt(button.dataset.price, 10);
        button.disabled = money < price;
    });
}

function buyItem(button, money, updateMoneyCallback) {
    const price = parseInt(button.dataset.price, 10);
    const item = button.dataset.item;

    if (money >= price) {
        money -= price;
        updateMoneyCallback(money);

        // Ajouter l'article à la garde-robe
        let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
        wardrobe[item] = true;
        localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    }
}

function saveMoney(money) {
    localStorage.setItem('money', money);
}

function saveCharacterState() {
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    localStorage.setItem('characterState', JSON.stringify(wardrobe));
}

function loadCharacterState() {
    const wardrobe = JSON.parse(localStorage.getItem('characterState')) || {};
    updateCharacterImage(wardrobe);
}

function loadWardrobe() {
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    const wardrobeItemsContainer = document.getElementById('wardrobe-items');
    wardrobeItemsContainer.innerHTML = '';

    for (let item in wardrobe) {
        if (wardrobe[item]) {
            const button = document.createElement('button');
            button.textContent = `Porter ${item}`;
            button.addEventListener('click', () => {
                wardrobe[item] = !wardrobe[item];
                updateCharacterImage(wardrobe);
                saveCharacterState();
            });
            wardrobeItemsContainer.appendChild(button);
        }
    }
}

function updateCharacterImage(wardrobe) {
    let imageSrc = 'assets/default.png';

    // Logique pour déterminer quelle image afficher en fonction des articles portés
    if (wardrobe['hat'] && wardrobe['shirt'] && wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/complete-outfit.png';
    } else if (wardrobe['hat'] && wardrobe['shirt'] && wardrobe['pants']) {
        imageSrc = 'assets/hat-shirt-pants.png';
    } else if (wardrobe['shirt'] && wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/shirt-pants-shoes.png';
    } else if (wardrobe['shirt'] && wardrobe['pants']) {
        imageSrc = 'assets/shirt-pants.png';
    } else if (wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/pants-shoes.png';
    } else if (wardrobe['shirt'] && wardrobe['shoes']) {
        imageSrc = 'assets/shirt-shoes.png';
    } else if (wardrobe['hat']) {
        imageSrc = 'assets/hat.png';
    } else if (wardrobe['shirt']) {
        imageSrc = 'assets/shirt.png';
    } else if (wardrobe['pants']) {
        imageSrc = 'assets/pants.png';
    } else if (wardrobe['shoes']) {
        imageSrc = 'assets/shoes.png';
    }

    document.getElementById('character').src = imageSrc;
}
