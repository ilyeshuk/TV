document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'historique des habitudes depuis le localStorage
    const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {};
    
    // Calculer le nombre total d'habitudes accomplies aujourd'hui
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    
    const completedHabitsToday = habitHistory[formattedDate] || 0;

    // Chaque habitude réalisée donne 2 pièces
    let money = completedHabitsToday * 2;
    updateMoneyDisplay(money);

    // Charger l'état du personnage sauvegardé
    loadCharacterState();

    document.querySelectorAll('.shop-item').forEach(button => {
        button.addEventListener('click', () => {
            buyItem(button, money, (newMoney) => {
                money = newMoney;
                updateMoneyDisplay(money);
                saveCharacterState();
            });
        });
    });
});

function updateMoneyDisplay(money) {
    document.getElementById('money').textContent = money;
    document.querySelectorAll('.shop-item').forEach(button => {
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
        document.getElementById('character').src = item;
    }
}

function saveCharacterState() {
    const characterSrc = document.getElementById('character').src;
    localStorage.setItem('characterState', JSON.stringify({ characterSrc }));
}

function loadCharacterState() {
    const savedState = JSON.parse(localStorage.getItem('characterState'));
    if (savedState && savedState.characterSrc) {
        document.getElementById('character').src = savedState.characterSrc;
    }
}
