document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'historique des habitudes depuis le localStorage ou initialiser à un objet vide si non disponible
    const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {}; 
    console.log("HabitHistory récupéré :", habitHistory); // Affiche l'historique des habitudes dans la console

    // Récupérer le montant d'argent actuel depuis le localStorage ou initialiser à 0 si non disponible
    let money = parseInt(localStorage.getItem('money')) || 0;
    console.log("Argent actuel avant calcul :", money); // Affiche le montant d'argent actuel

    // Obtenir la date d'aujourd'hui avec l'heure exacte (incluant les secondes)
    const today = new Date();
    
    // Formater le jour, mois, et année de la date d'aujourd'hui
    const day = ('0' + today.getDate()).slice(-2); // Formater le jour avec un zéro devant si nécessaire
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Formater le mois avec un zéro devant si nécessaire (les mois commencent à 0)
    const year = today.getFullYear(); // Récupérer l'année complète

    // Formater l'heure, minutes et secondes de la date d'aujourd'hui
    const hours = ('0' + today.getHours()).slice(-2); // Formater l'heure avec un zéro devant si nécessaire
    const minutes = ('0' + today.getMinutes()).slice(-2); // Formater les minutes avec un zéro devant si nécessaire
    const seconds = ('0' + today.getSeconds()).slice(-2); // Formater les secondes avec un zéro devant si nécessaire

    // Combiner jour, mois, année pour créer une chaîne de date sans les secondes
    const formattedDate = `${day}/${month}/${year}`;
    console.log("Date d'aujourd'hui :", formattedDate); // Affiche la date d'aujourd'hui sans les secondes

    // Combiner la date avec l'heure exacte pour créer une chaîne de date avec les secondes
    const formattedDateWithSeconds = `${formattedDate} ${hours}:${minutes}:${seconds}`;
    console.log("Date et heure exactes :", formattedDateWithSeconds); // Affiche la date d'aujourd'hui avec les secondes

    // Vérifier le nombre d'habitudes complétées aujourd'hui (stockées avec la date sans secondes)
    const completedHabitsToday = habitHistory[formattedDate] || 0; 
    console.log("Habitudes complétées aujourd'hui :", completedHabitsToday); // Affiche le nombre d'habitudes complétées aujourd'hui

    // Récupérer la dernière date à laquelle l'argent a été calculé depuis le localStorage
    const lastCalculatedDateWithSeconds = localStorage.getItem('lastCalculatedDateWithSeconds');
    console.log("Dernière date de calcul de l'argent (avec secondes) :", lastCalculatedDateWithSeconds); // Affiche la dernière date de calcul avec les secondes

    // Vérifier si la date (avec secondes) a changé ou si de nouvelles habitudes ont été complétées depuis le dernier calcul
    if (lastCalculatedDateWithSeconds !== formattedDateWithSeconds) {
        // Calcule l'argent à ajouter pour les nouvelles habitudes complétées aujourd'hui
        const newMoney = completedHabitsToday; // Utilisation des habitudes du jour, car c'est la première vérification de la journée

        // Si des nouvelles habitudes ont été complétées, ajouter les récompenses correspondantes
        if (newMoney > 0) {
            money += newMoney * 2; // Multiplie le nombre d'habitudes complétées par 2 pour calculer l'argent
            console.log(`Ajout de ${newMoney * 2} pièces pour ${newMoney} nouvelles habitudes complétées.`); // Affiche l'argent ajouté et les nouvelles habitudes complétées
        }

        // Mettre à jour l'affichage de l'argent
        updateMoneyDisplay(money);

        // Sauvegarder le nouveau montant d'argent dans le localStorage
        saveMoney(money);

        // Mettre à jour la dernière date de calcul d'argent avec la nouvelle date (avec secondes)
        localStorage.setItem('lastCalculatedDateWithSeconds', formattedDateWithSeconds);
    } else {
        console.log("Pas de nouvelles habitudes ou argent déjà calculé pour aujourd'hui."); // Si aucune nouvelle habitude n'a été complétée ou si l'argent a déjà été calculé pour cette seconde
        updateMoneyDisplay(money); // Met à jour l'affichage de l'argent même si aucun changement n'a été fait
    }

    // Charger l'état du personnage à partir du localStorage
    loadCharacterState();

    // Charger la garde-robe à partir du localStorage
    loadWardrobe();
});

function updateMoneyDisplay(money) {
    // Mettre à jour le texte affiché de l'élément avec l'id 'money' avec le nouveau montant d'argent
    document.getElementById('money').textContent = money;
    console.log("Affichage de l'argent mis à jour :", money); // Affiche le montant d'argent mis à jour dans la console

    // Désactiver les boutons d'achat des articles qui sont plus chers que le montant d'argent actuel
    document.querySelectorAll('.shop-item button').forEach(button => {
        const price = parseInt(button.dataset.price, 10);
        button.disabled = money < price; // Désactive le bouton si l'argent est insuffisant, sinon l'active
        console.log(`Bouton pour ${button.dataset.item} : ${money < price ? 'désactivé' : 'activé'}`); // Affiche dans la console si le bouton est activé ou désactivé
    });
}

function buyItem(button) {
    // Récupérer le montant d'argent actuel depuis le localStorage
    let money = parseInt(localStorage.getItem('money')) || 0;

    // Récupérer le prix de l'article depuis l'attribut data-price du bouton
    const price = parseInt(button.dataset.price, 10);

    // Récupérer le nom de l'article depuis l'attribut data-item du bouton
    const item = button.dataset.item;

    // Vérifier si l'utilisateur a suffisamment d'argent pour acheter l'article
    if (money >= price) {
        // Déduire le prix de l'article du montant d'argent
        money -= price;

        // Sauvegarder le nouveau montant d'argent dans le localStorage
        saveMoney(money);

        // Mettre à jour l'affichage du montant d'argent sur l'écran
        updateMoneyDisplay(money);

        // Récupérer la garde-robe actuelle depuis le localStorage
        let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};

        // Ajouter l'article à la garde-robe de l'utilisateur
        wardrobe[item] = true;

        // Sauvegarder la nouvelle garde-robe dans le localStorage
        localStorage.setItem('wardrobe', JSON.stringify(wardrobe));

        // Afficher un message dans la console indiquant que l'article a été acheté
        console.log(`Article acheté : ${item}`);

        // Recharger la garde-robe pour refléter l'achat effectué
        loadWardrobe();
    } else {
        // Si l'utilisateur n'a pas assez d'argent, afficher un message dans la console
        console.log("Pas assez d'argent pour acheter cet article.");
    }
}

// Ajouter un événement 'click' à chaque bouton d'article du magasin
document.querySelectorAll('.shop-item button').forEach(button => {
    button.addEventListener('click', function() {
        buyItem(button);
    });
});

function saveMoney(money) {
    // Sauvegarder le montant d'argent actuel dans le localStorage
    localStorage.setItem('money', money);
    console.log("Argent sauvegardé :", money); // Affiche un message dans la console indiquant que l'argent a été sauvegardé
}

function saveCharacterState() {
    // Récupérer la garde-robe actuelle depuis le localStorage ou initialiser à un objet vide si non disponible
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};

    // Sauvegarder l'état actuel du personnage (garde-robe) dans le localStorage
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    console.log("État du personnage sauvegardé :", wardrobe); // Affiche un message dans la console indiquant que l'état du personnage a été sauvegardé
}

function loadCharacterState() {
    // Récupérer l'état actuel du personnage depuis le localStorage ou initialiser à un objet vide si non disponible
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("État du personnage chargé :", wardrobe); // Affiche l'état du personnage chargé dans la console

    // Mettre à jour l'image du personnage en fonction de l'état actuel de la garde-robe
    updateCharacterImage(wardrobe);
}

function loadWardrobe() {
    // Récupérer la garde-robe actuelle depuis le localStorage ou initialiser à un objet vide si non disponible
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("Garde-robe chargée :", wardrobe); // Affiche la garde-robe chargée dans la console

    // Sélectionner l'élément du DOM où les articles de la garde-robe seront affichés
    const wardrobeItemsContainer = document.getElementById('wardrobe-items');
    wardrobeItemsContainer.innerHTML = ''; // Vide le contenu actuel du conteneur de la garde-robe

    // Pour chaque type d'article (chapeau, chemise, pantalon, chaussures)
    ['hat', 'shirt', 'pants', 'shoes'].forEach(item => {
        // Créer un bouton pour chaque article
        const button = document.createElement('button');
        button.textContent = `Porter ${item}`; // Définit le texte du bouton
        button.dataset.item = item; // Définit l'attribut data-item avec le nom de l'article
        button.classList.add('wardrobe-item'); // Ajoute la classe CSS 'wardrobe-item' au bouton

        // Si l'article est actuellement porté (présent dans la garde-robe)
        if (wardrobe[item]) {
            button.classList.add('selected'); // Ajoute la classe CSS 'selected' au bouton
        }

        // Ajouter un gestionnaire d'événement pour le clic sur le bouton
        button.addEventListener('click', () => {
            wardrobe[item] = !wardrobe[item]; // Inverser l'état de l'article (le porter ou non)
            saveCharacterState(); // Sauvegarder l'état actuel du personnage
            updateCharacterImage(wardrobe); // Mettre à jour l'image du personnage en fonction de la garde-robe

            // Mettre à jour l'apparence du bouton en fonction de l'état actuel de l'article
            if (wardrobe[item]) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        // Ajouter le bouton au conteneur de la garde-robe dans le DOM
        wardrobeItemsContainer.appendChild(button);
    });
}

function updateCharacterImage(wardrobe) {
    // Définit l'image par défaut du personnage
    let imageSrc = 'assets/default.png';

    // Modifier l'image du personnage en fonction des articles portés
    if (wardrobe['hat'] && wardrobe['shirt'] && wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/complete-outfit.png'; // Si tous les articles sont portés
    } else if (wardrobe['hat'] && wardrobe['shirt'] && wardrobe['pants']) {
        imageSrc = 'assets/hat-shirt-pants.png'; // Si chapeau, chemise et pantalon sont portés
    } else if (wardrobe['shirt'] && wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/shirt-pants-shoes.png'; // Si chemise, pantalon et chaussures sont portés
    } else if (wardrobe['shirt'] && wardrobe['pants']) {
        imageSrc = 'assets/shirt-pants.png'; // Si chemise et pantalon sont portés
    } else if (wardrobe['pants'] && wardrobe['shoes']) {
        imageSrc = 'assets/pants-shoes.png'; // Si pantalon et chaussures sont portés
    } else if (wardrobe['shirt'] && wardrobe['shoes']) {
        imageSrc = 'assets/shirt-shoes.png'; // Si chemise et chaussures sont portés
    } else if (wardrobe['hat'] && wardrobe['shoes']) {
        imageSrc = 'assets/hat-shoes.png'; // Si chapeau et chaussures sont portés
    } else if (wardrobe['hat'] && wardrobe['shirt']) {
        imageSrc = 'assets/hat-shirt.png'; // Si chapeau et chemise sont portés
    } else if (wardrobe['hat']) {
        imageSrc = 'assets/hat.png'; // Si seul le chapeau est porté
    } else if (wardrobe['shirt']) {
        imageSrc = 'assets/shirt.png'; // Si seule la chemise est portée
    } else if (wardrobe['pants']) {
        imageSrc = 'assets/pants.png'; // Si seul le pantalon est porté
    } else if (wardrobe['shoes']) {
        imageSrc = 'assets/shoes.png'; // Si seules les chaussures sont portées
    }

    // Mettre à jour l'élément d'image du personnage avec la nouvelle source d'image
    document.getElementById('character').src = imageSrc;
    console.log("Image du personnage mise à jour :", imageSrc); // Affiche la nouvelle source d'image dans la console
}

// Gestionnaire d'événement pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    // Sélectionner la barre latérale et le bouton de menu
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');

    // Basculer l'état actif de la barre latérale et du bouton de menu (afficher/masquer)
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
