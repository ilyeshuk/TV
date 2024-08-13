document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'historique des habitudes depuis le localStorage ou initialiser à un objet vide si non disponible
    const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {}; 
    console.log("HabitHistory récupéré :", habitHistory); // Affiche l'historique des habitudes dans la console pour vérifier les données récupérées

    // Récupérer le montant d'argent actuel depuis le localStorage ou initialiser à 0 si non disponible
    let money = parseInt(localStorage.getItem('money') || '0', 10);
    console.log("Argent actuel avant calcul :", money); // Affiche le montant d'argent actuel pour vérification

    // Obtenir la date et l'heure actuelles (avec secondes précises)
    const today = new Date();
    
    // Formater les composants de la date (jour, mois, année) avec des zéros devant si nécessaire pour assurer un formatage cohérent
    const day = ('0' + today.getDate()).slice(-2); // Récupère le jour et ajoute un zéro devant si le jour est inférieur à 10
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Récupère le mois et ajoute un zéro devant si le mois est inférieur à 10 (les mois commencent à 0)
    const year = today.getFullYear(); // Récupère l'année actuelle

    // Formater l'heure, minutes, et secondes de la date actuelle, avec des zéros devant si nécessaire
    const hours = ('0' + today.getHours()).slice(-2); // Récupère l'heure et ajoute un zéro devant si l'heure est inférieure à 10
    const minutes = ('0' + today.getMinutes()).slice(-2); // Récupère les minutes et ajoute un zéro devant si les minutes sont inférieures à 10
    const seconds = ('0' + today.getSeconds()).slice(-2); // Récupère les secondes et ajoute un zéro devant si les secondes sont inférieures à 10

    // Combiner les composants jour, mois et année pour créer une chaîne de date sans les secondes
    const formattedDate = `${day}/${month}/${year}`;
    console.log("Date d'aujourd'hui :", formattedDate); // Affiche la date d'aujourd'hui sans les secondes pour vérification

    // Combiner la date et l'heure exactes (avec secondes) pour créer une chaîne de date complète
    const formattedDateWithSeconds = `${formattedDate} ${hours}:${minutes}:${seconds}`;
    console.log("Date et heure exactes :", formattedDateWithSeconds); // Affiche la date d'aujourd'hui avec les secondes pour vérification

    // Récupérer le nombre d'habitudes complétées aujourd'hui en utilisant la date sans les secondes comme clé
    const completedHabitsToday = habitHistory[formattedDate] || 0; 
    console.log("Habitudes complétées aujourd'hui :", completedHabitsToday); // Affiche le nombre d'habitudes complétées aujourd'hui pour vérification

    // Récupérer la dernière date à laquelle l'argent a été calculé depuis le localStorage
    const lastCalculatedDate = localStorage.getItem('lastCalculatedDate');
    // Récupérer la dernière date et heure (avec secondes) où l'argent a été calculé
    const lastCalculatedDateWithSeconds = localStorage.getItem('lastCalculatedDateWithSeconds');
    console.log("Dernière date de calcul de l'argent :", lastCalculatedDate); // Affiche la dernière date de calcul (sans secondes) pour vérification
    console.log("Dernière date de calcul de l'argent (avec secondes) :", lastCalculatedDateWithSeconds); // Affiche la dernière date de calcul avec secondes pour vérification
    console.log("Dernière habitude de calcul de l'argent (avec secondes) :", habitHistory[lastCalculatedDateWithSeconds]);
    console.log("Dernière habitude de calcul de l'argent en ce moment (avec secondes) :", habitHistory[formattedDateWithSeconds]);

    // Première vérification : Si la date actuelle (sans secondes) est différente de la dernière date de calcul
    if (lastCalculatedDate !== formattedDate) {
        // Si c'est un nouveau jour, calculer l'argent basé sur les habitudes complétées aujourd'hui
        const newMoney = completedHabitsToday; // Utilisation des habitudes du jour

        
        money += newMoney * 2; // Ajouter l'argent gagné (chaque habitude complétée ajoute 2 unités d'argent)
        console.log(`Ajout de ${newMoney * 2} pièces pour ${newMoney} nouvelles habitudes complétées.`); // Affiche l'argent ajouté pour vérification
        
        // Mettre à jour l'affichage de l'argent sur la page
        updateMoneyDisplay(money);

        // Sauvegarder le nouveau montant d'argent dans le localStorage
        saveMoney(money);

        // Mettre à jour la dernière date de calcul d'argent dans le localStorage (avec et sans secondes)
        localStorage.setItem('lastCalculatedDate', formattedDate);
        localStorage.setItem('lastCalculatedDateWithSeconds', formattedDateWithSeconds);

    // Deuxième vérification : Si la date avec secondes a changé, comparer les habitudes entre les deux moments
    } else if (habitHistory[lastCalculatedDateWithSeconds] !== habitHistory[formattedDateWithSeconds]) {
        // Si les habitudes à ces deux moments sont différentes, il y a eu des habitudes supplémentaires

        // Calculer l'argent supplémentaire en fonction des habitudes complétées entre les deux moments
        const previousHabits = habitHistory[lastCalculatedDateWithSeconds] || 0; // Obtenir les habitudes précédentes pour comparaison
        const currentHabits = habitHistory[formattedDateWithSeconds] || 0; // Obtenir les habitudes actuelles pour comparaison
        const newMoney = currentHabits - previousHabits; // Calculer la différence pour savoir combien d'habitudes supplémentaires ont été complétées

        console.log(`Ajout d'habitudes aujourd'hui : ${newMoney} = ${currentHabits} - ${previousHabits} `);
        
        money += newMoney * 2; // Ajouter l'argent supplémentaire pour les nouvelles habitudes complétées
        console.log(`Ajout de ${newMoney * 2} pièces pour ${newMoney} nouvelles habitudes complétées depuis la dernière vérification.`); // Affiche l'argent ajouté pour vérification

        // Mettre à jour l'affichage de l'argent sur la page
        updateMoneyDisplay(money);

        // Sauvegarder le nouveau montant d'argent dans le localStorage
        saveMoney(money);

        // Mettre à jour la dernière date de calcul avec les secondes dans le localStorage
        localStorage.setItem('lastCalculatedDateWithSeconds', formattedDateWithSeconds);

    // Cas où aucune nouvelle habitude n'a été complétée ou où l'argent a déjà été calculé pour aujourd'hui
    } else {
        console.log("Pas de nouvelles habitudes ou argent déjà calculé pour aujourd'hui."); // Logique pour indiquer que rien de nouveau n'a été fait
        updateMoneyDisplay(money); // Mettre à jour l'affichage de l'argent même si aucun changement n'a été fait, pour cohérence
    }

    // Charger l'état du personnage à partir du localStorage pour afficher les vêtements portés, etc.
    loadCharacterState();

    // Charger la garde-robe à partir du localStorage pour mettre à jour l'interface utilisateur avec les articles disponibles
    loadWardrobe();
});

// Fonction pour mettre à jour l'affichage du montant d'argent sur la page
function updateMoneyDisplay(money) {
    // Mettre à jour l'élément avec l'id 'money' pour afficher le montant d'argent actuel
    document.getElementById('money').textContent = money;
    console.log("Affichage de l'argent mis à jour :", money); // Affiche le montant d'argent mis à jour pour vérification

    // Désactiver les boutons d'achat des articles qui sont plus chers que le montant d'argent actuel
    document.querySelectorAll('.shop-item button').forEach(button => {
        const price = parseInt(button.dataset.price, 10); // Récupère le prix de l'article à partir de l'attribut data-price du bouton
        button.disabled = money < price; // Désactive le bouton si l'utilisateur n'a pas assez d'argent, sinon l'active
        console.log(`Bouton pour ${button.dataset.item} : ${money < price ? 'désactivé' : 'activé'}`); // Affiche dans la console si le bouton est activé ou désactivé
    });
}

// Fonction appelée lorsqu'un utilisateur achète un article en cliquant sur un bouton
function buyItem(button) {
    // Récupérer le montant d'argent actuel depuis le localStorage
    let money = parseInt(localStorage.getItem('money')) || 0;

    // Récupérer le prix de l'article depuis l'attribut data-price du bouton cliqué
    const price = parseInt(button.dataset.price, 10);

    // Récupérer le nom de l'article depuis l'attribut data-item du bouton cliqué
    const item = button.dataset.item;

    // Vérifier si l'utilisateur a suffisamment d'argent pour acheter l'article
    if (money >= price) {
        money -= price; // Déduit le prix de l'article du montant d'argent actuel

        // Sauvegarder le nouveau montant d'argent dans le localStorage
        saveMoney(money);

        // Mettre à jour l'affichage du montant d'argent sur l'écran
        updateMoneyDisplay(money);

        // Récupérer la garde-robe actuelle depuis le localStorage, ou initialiser à un objet vide si elle n'existe pas
        let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};

        // Ajouter l'article acheté à la garde-robe de l'utilisateur
        wardrobe[item] = true;

        // Sauvegarder la nouvelle garde-robe dans le localStorage
        localStorage.setItem('wardrobe', JSON.stringify(wardrobe));

        // Afficher un message dans la console pour confirmer que l'article a été acheté
        console.log(`Article acheté : ${item}`);

        // Recharger la garde-robe pour refléter l'achat effectué dans l'interface utilisateur
        loadWardrobe();
    } else {
        // Si l'utilisateur n'a pas assez d'argent, afficher un message dans la console pour indiquer l'échec de l'achat
        console.log("Pas assez d'argent pour acheter cet article.");
    }
}

// Ajoute un événement 'click' à chaque bouton d'article du magasin pour permettre l'achat d'articles
document.querySelectorAll('.shop-item button').forEach(button => {
    button.addEventListener('click', function() {
        buyItem(button); // Appelle la fonction buyItem lorsque le bouton est cliqué
    });
});

// Fonction pour sauvegarder le montant d'argent dans le localStorage
function saveMoney(money) {
    localStorage.setItem('money', money); // Stocke le montant d'argent dans le localStorage
    console.log("Argent sauvegardé :", money); // Affiche un message dans la console pour indiquer que l'argent a été sauvegardé
}

// Fonction pour sauvegarder l'état actuel du personnage dans le localStorage (ce qu'il porte, etc.)
function saveCharacterState() {
    // Récupérer la garde-robe actuelle depuis le localStorage, ou initialiser à un objet vide si elle n'existe pas
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};

    // Sauvegarder l'état actuel du personnage (garde-robe) dans le localStorage
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    console.log("État du personnage sauvegardé :", wardrobe); // Affiche un message dans la console pour indiquer que l'état du personnage a été sauvegardé
}

// Fonction pour charger l'état du personnage depuis le localStorage et mettre à jour l'affichage
function loadCharacterState() {
    // Récupérer l'état actuel du personnage depuis le localStorage, ou initialiser à un objet vide si elle n'existe pas
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("État du personnage chargé :", wardrobe); // Affiche l'état du personnage chargé dans la console pour vérification

    // Mettre à jour l'image du personnage en fonction de l'état actuel de la garde-robe
    updateCharacterImage(wardrobe);
}

// Fonction pour charger et afficher la garde-robe dans l'interface utilisateur
function loadWardrobe() {
    // Récupérer la garde-robe actuelle depuis le localStorage, ou initialiser à un objet vide si elle n'existe pas
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("Garde-robe chargée :", wardrobe); // Affiche la garde-robe chargée dans la console pour vérification

    // Sélectionner l'élément du DOM où les articles de la garde-robe seront affichés
    const wardrobeItemsContainer = document.getElementById('wardrobe-items');
    wardrobeItemsContainer.innerHTML = ''; // Vide le contenu actuel du conteneur de la garde-robe

    // Pour chaque type d'article disponible (chapeau, chemise, pantalon, chaussures)
    ['hat', 'shirt', 'pants', 'shoes'].forEach(item => {
        // Créer un bouton pour chaque article
        const button = document.createElement('button');
        button.textContent = `Porter ${item}`; // Définit le texte du bouton
        button.dataset.item = item; // Définit l'attribut data-item avec le nom de l'article
        button.classList.add('wardrobe-item'); // Ajoute la classe CSS 'wardrobe-item' au bouton

        // Si l'article est actuellement porté (présent dans la garde-robe)
        if (wardrobe[item]) {
            button.classList.add('selected'); // Ajoute la classe CSS 'selected' au bouton pour indiquer qu'il est porté
        }

        // Ajouter un gestionnaire d'événement pour le clic sur le bouton
        button.addEventListener('click', () => {
            wardrobe[item] = !wardrobe[item]; // Inverser l'état de l'article (le porter ou non)
            saveCharacterState(); // Sauvegarder l'état actuel du personnage dans le localStorage
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

// Fonction pour mettre à jour l'image du personnage en fonction de la garde-robe
function updateCharacterImage(wardrobe) {
    // Définit l'image par défaut du personnage si aucun vêtement n'est porté
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
    console.log("Image du personnage mise à jour :", imageSrc); // Affiche la nouvelle source d'image dans la console pour vérification
}

// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
