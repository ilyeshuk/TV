document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'historique des habitudes et les jetons depuis le localStorage
    const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {}; 
    console.log("HabitHistory récupéré :", habitHistory);
    console.log("Contenu complet de HabitHistory :", JSON.stringify(habitHistory, null, 2));

    // Récupère l'argent actuel stocké dans le localStorage, ou 0 si aucune donnée n'est trouvée
    let money = parseInt(localStorage.getItem('money')) || 0;
    console.log("Argent actuel avant calcul :", money);

    // Formattage de la date actuelle en format "DD/MM/YYYY"
    const today = new Date();
    const day = ('0' + today.getDate()).slice(-2);
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    console.log("Date d'aujourd'hui :", formattedDate);

    // Récupération de la dernière date à laquelle les jetons ont été calculés
    const lastCalculatedDate = localStorage.getItem('lastCalculatedDate');
    console.log("Dernière date de calcul :", lastCalculatedDate);

    // Vérification si la date actuelle est différente de la dernière date calculée
    if (lastCalculatedDate !== formattedDate) {
        // On récupère le nombre d'habitudes accomplies aujourd'hui à partir de l'historique
        const completedHabitsToday = habitHistory[formattedDate] || 0;
        console.log("Habitudes complétées aujourd'hui :", completedHabitsToday);

        // Si des habitudes ont été accomplies, on ajoute l'argent correspondant
        if (completedHabitsToday > 0) {
            console.log(`Ajout de ${completedHabitsToday * 2} pièces pour ${completedHabitsToday} habitudes complétées.`);
            money += completedHabitsToday * 2;
            console.log("Nouveau montant d'argent après ajout :", money);
        } else {
            console.log("Aucune habitude complétée aujourd'hui ou problème avec le format de la date.");
        }

        // Mise à jour de l'affichage de l'argent
        updateMoneyDisplay(money);
        // Sauvegarde du nouveau montant d'argent dans le localStorage
        saveMoney(money);
        // Enregistrement de la date actuelle comme dernière date de calcul des jetons
        localStorage.setItem('lastCalculatedDate', formattedDate);
        console.log("Dernière date de calcul mise à jour :", formattedDate);
    } else {
        // Si on a déjà calculé les jetons aujourd'hui, on met à jour l'affichage sans ajouter d'argent
        console.log("L'argent a déjà été calculé aujourd'hui. Pas de mise à jour nécessaire.");
        updateMoneyDisplay(money);
    }
});

function updateMoneyDisplay(money) {
    // Met à jour l'affichage de l'argent à l'écran
    document.getElementById('money').textContent = money;
    console.log("Affichage de l'argent mis à jour :", money);

    // Désactive les boutons de la boutique si l'utilisateur n'a pas assez d'argent pour acheter un article
    document.querySelectorAll('.shop-item button').forEach(button => {
        const price = parseInt(button.dataset.price, 10);
        console.log(`Prix de l'article : ${price} | Argent disponible : ${money}`);
        button.disabled = money < price;
    });
}

function buyItem(button, money, updateMoneyCallback) {
    // Récupère le prix et l'item correspondant au bouton cliqué
    const price = parseInt(button.dataset.price, 10);
    const item = button.dataset.item;
    console.log("Tentative d'achat de l'article :", item, "pour", price, "pièces. Argent disponible :", money);

    // Si l'utilisateur a assez d'argent, on procède à l'achat
    if (money >= price) {
        money -= price; // On déduit le prix de l'article de l'argent total
        console.log("Achat réussi. Argent restant :", money);
        updateMoneyCallback(money); // Mise à jour de l'argent après l'achat

        // On ajoute l'article acheté à la garde-robe dans le localStorage
        let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
        wardrobe[item] = true;
        localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
        console.log("Article ajouté à la garde-robe :", item);
    } else {
        console.log("Achat échoué : pas assez d'argent.");
    }
}

function saveMoney(money) {
    // Sauvegarde le montant actuel d'argent dans le localStorage
    localStorage.setItem('money', money);
    console.log("Argent sauvegardé :", money);
}

function saveCharacterState() {
    // Sauvegarde l'état actuel du personnage (articles portés) dans le localStorage
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    localStorage.setItem('characterState', JSON.stringify(wardrobe));
    console.log("État du personnage sauvegardé :", wardrobe);
}

function loadCharacterState() {
    // Charge l'état du personnage depuis le localStorage
    const wardrobe = JSON.parse(localStorage.getItem('characterState')) || {};
    console.log("État du personnage chargé :", wardrobe);
    updateCharacterImage(wardrobe);
}

function loadWardrobe() {
    // Charge la garde-robe depuis le localStorage et affiche les articles achetés
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("Garde-robe chargée :", wardrobe);
    const wardrobeItemsContainer = document.getElementById('wardrobe-items');
    wardrobeItemsContainer.innerHTML = ''; // Vide la garde-robe avant de la recharger

    // Pour chaque article dans la garde-robe, on crée un bouton pour le porter
    for (let item in wardrobe) {
        if (wardrobe[item]) {
            const button = document.createElement('button');
            button.textContent = `Porter ${item}`;
            button.classList.add('wardrobe-item');

            // Si l'article est sélectionné, on applique la classe 'selected'
            if (wardrobe[item]) {
                button.classList.add('selected');
                console.log("Article porté :", item);
            }

            // Ajoute un événement de clic pour sélectionner/désélectionner l'article
            button.addEventListener('click', () => {
                wardrobe[item] = !wardrobe[item];
                if (wardrobe[item]) {
                    button.classList.add('selected');
                    console.log("Article sélectionné :", item);
                } else {
                    button.classList.remove('selected');
                    console.log("Article désélectionné :", item);
                }
                updateCharacterImage(wardrobe); // Mise à jour de l'image du personnage
                saveCharacterState(); // Sauvegarde de l'état actuel du personnage
            });
            wardrobeItemsContainer.appendChild(button); // Ajoute le bouton à la garde-robe
        }
    }
}

function updateCharacterImage(wardrobe) {
    // Détermine quelle image du personnage afficher en fonction des articles portés
    let imageSrc = 'assets/default.png';

    if (wardrobe['hat'] && wardrobe['shirt'] && wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/complete-outfit.png';
        console.log("Affichage : ensemble complet.");
    } else if (wardrobe['hat'] && wardrobe['shirt'] && wardrobe['pants']) {
        imageSrc = 'assets/hat-shirt-pants.png';
        console.log("Affichage : chapeau, chemise, pantalon.");
    } else if (wardrobe['shirt'] && wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/shirt-pants-shoes.png';
        console.log("Affichage : chemise, pantalon, chaussures.");
    } else if (wardrobe['shirt'] && wardrobe['pants']) {
        imageSrc = 'assets/shirt-pants.png';
        console.log("Affichage : chemise, pantalon.");
    } else if (wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/pants-shoes.png';
        console.log("Affichage : pantalon, chaussures.");
    } else if (wardrobe['shirt'] && wardrobe['shoes']) {
        imageSrc = 'assets/shirt-shoes.png';
        console.log("Affichage : chemise, chaussures.");
    } else if (wardrobe['hat']) {
        imageSrc = 'assets/hat.png';
        console.log("Affichage : chapeau.");
    } else if (wardrobe['shirt']) {
        imageSrc = 'assets/shirt.png';
        console.log("Affichage : chemise.");
    } else if (wardrobe['pants']) {
        imageSrc = 'assets/pants.png';
        console.log("Affichage : pantalon.");
    } else if (wardrobe['shoes']) {
        imageSrc = 'assets/shoes.png';
        console.log("Affichage : chaussures.");
    }

    // Mise à jour de l'image du personnage avec la bonne combinaison d'articles portés
    document.getElementById('character').src = imageSrc;
    console.log("Image du personnage mise à jour :", imageSrc);
}
