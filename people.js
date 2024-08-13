document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'historique des habitudes et les jetons depuis le localStorage
    const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {}; 
    console.log("HabitHistory récupéré :", habitHistory);

    let money = parseInt(localStorage.getItem('money')) || 0;
    console.log("Argent actuel avant calcul :", money);

    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    console.log("Date d'aujourd'hui :", formattedDate);

    // Vérifier le nombre d'habitudes complétées aujourd'hui
    const completedHabitsToday = habitHistory[formattedDate] || 0;
    console.log("Habitudes complétées aujourd'hui :", completedHabitsToday);

    const lastCalculatedDate = localStorage.getItem('lastCalculatedDate');

    // Calculer l'argent uniquement si la date a changé ou si de nouvelles habitudes ont été complétées
    if (lastCalculatedDate !== formattedDate && completedHabitsToday > 0) {
        const newMoney = completedHabitsToday * 2;
        money += newMoney;
        console.log(`Ajout de ${newMoney} pièces pour ${completedHabitsToday} habitudes complétées.`);
        
        updateMoneyDisplay(money);
        saveMoney(money);
        localStorage.setItem('lastCalculatedDate', formattedDate);
    } else {
        console.log("Pas de nouvelles habitudes ou argent déjà calculé pour aujourd'hui.");
        updateMoneyDisplay(money);
    }

    loadCharacterState();
    loadWardrobe();
});

function updateMoneyDisplay(money) {
    document.getElementById('money').textContent = money;
    console.log("Affichage de l'argent mis à jour :", money);

    document.querySelectorAll('.shop-item button').forEach(button => {
        const price = parseInt(button.dataset.price, 10);
        button.disabled = money < price;
        console.log(`Bouton pour ${button.dataset.item} : ${money < price ? 'désactivé' : 'activé'}`);
    });
}

function buyItem(button) {
    let money = parseInt(localStorage.getItem('money')) || 0;
    const price = parseInt(button.dataset.price, 10);
    const item = button.dataset.item;

    // Vérifier si l'utilisateur a assez d'argent
    if (money >= price) {
        // Déduire le prix de l'article
        money -= price;
        saveMoney(money);
        updateMoneyDisplay(money);

        // Ajouter l'article à la garde-robe
        let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
        wardrobe[item] = true;
        localStorage.setItem('wardrobe', JSON.stringify(wardrobe));

        console.log(`Article acheté : ${item}`);
        loadWardrobe();
    } else {
        console.log("Pas assez d'argent pour acheter cet article.");
    }
}

document.querySelectorAll('.shop-item button').forEach(button => {
    button.addEventListener('click', function() {
        buyItem(button);
    });
});

function saveMoney(money) {
    localStorage.setItem('money', money);
    console.log("Argent sauvegardé :", money);
}

function saveCharacterState() {
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    localStorage.setItem('characterState', JSON.stringify(wardrobe));
    console.log("État du personnage sauvegardé :", wardrobe);
}

function loadCharacterState() {
    const wardrobe = JSON.parse(localStorage.getItem('characterState')) || {};
    console.log("État du personnage chargé :", wardrobe);
    updateCharacterImage(wardrobe);
}

function loadWardrobe() {
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("Garde-robe chargée :", wardrobe);
    const wardrobeItemsContainer = document.getElementById('wardrobe-items');
    wardrobeItemsContainer.innerHTML = '';

    ['hat', 'shirt', 'pants', 'shoes'].forEach(item => {
        const button = document.createElement('button');
        button.textContent = `Porter ${item}`;
        button.dataset.item = item;
        button.classList.add('wardrobe-item');

        if (wardrobe[item]) {
            button.classList.add('selected');
        }

        button.addEventListener('click', () => {
            wardrobe[item] = !wardrobe[item];
            saveCharacterState();
            updateCharacterImage(wardrobe);

            if (wardrobe[item]) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        wardrobeItemsContainer.appendChild(button);
    });
}

function updateCharacterImage(wardrobe) {
    let imageSrc = 'assets/default.png';

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
    } else if (wardrobe['hat'] && wardrobe['shoes']) {
        imageSrc = 'assets/hat-shoes.png';
    } else if (wardrobe['hat'] && wardrobe['shirt']) {
        imageSrc = 'assets/hat-shirt.png';
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
    console.log("Image du personnage mise à jour :", imageSrc);
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
