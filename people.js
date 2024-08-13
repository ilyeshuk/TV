//Script JavaScript qui s'exécute lorsqu'une page Web est complètement chargée (DOMContentLoaded). 
//Ce script gère un système de suivi des habitudes quotidiennes, des récompenses monétaires associées, ainsi que l'état visuel d'un personnage dans l'interface.
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer l'historique des habitudes depuis le localStorage ou initialiser à un objet vide si non disponible
    const habitHistory = JSON.parse(localStorage.getItem('habitHistory')) || {}; 
    console.log("HabitHistory récupéré :", habitHistory); // Affiche l'historique des habitudes dans la console

    // Récupérer le montant d'argent actuel depuis le localStorage ou initialiser à 0 si non disponible
    let money = parseInt(localStorage.getItem('money')) || 0;
    console.log("Argent actuel avant calcul :", money); // Affiche le montant d'argent actuel

    // Obtenir la date d'aujourd'hui
    const today = new Date();
    // Extraire le jour, le mois et l'année de la date d'aujourd'hui et les formater
    const day = ('0' + today.getDate()).slice(-2); // Formater le jour avec un zéro devant si nécessaire
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // Formater le mois avec un zéro devant si nécessaire (les mois commencent à 0)
    const year = today.getFullYear(); // Récupérer l'année complète
    const formattedDate = `${day}/${month}/${year}`; // Combiner jour, mois et année dans un format de date lisible
    console.log("Date d'aujourd'hui :", formattedDate); // Affiche la date d'aujourd'hui

    // Vérifier le nombre d'habitudes complétées aujourd'hui
    const completedHabitsToday = habitHistory[formattedDate] || 0; 
    console.log("Habitudes complétées aujourd'hui :", completedHabitsToday); // Affiche le nombre d'habitudes complétées aujourd'hui

    // Récupérer la dernière date à laquelle l'argent a été calculé depuis le localStorage
    const lastCalculatedDate = localStorage.getItem('lastCalculatedDate');
    console.log("Dernière date de calcul de l'argent :", lastCalculatedDate); // Ajout d'un log pour vérifier la dernière date de calcul

    // Calculer l'argent uniquement si la date a changé ou si de nouvelles habitudes ont été complétées depuis le dernier calcul
    if (lastCalculatedDate !== formattedDate) {
        // Calcule l'argent à ajouter en fonction des nouvelles habitudes complétées
        const newMoney = (habitHistory[formattedDate] || 0) - (habitHistory[lastCalculatedDate] || 0);
        if (newMoney > 0) {
            money += newMoney * 2; // Multiplie le nombre d'habitudes complétées par 2 pour calculer l'argent
            console.log(`Ajout de ${newMoney * 2} pièces pour ${newMoney} nouvelles habitudes complétées.`); // Affiche l'argent ajouté et les nouvelles habitudes complétées
        }
        
        // Met à jour l'affichage de l'argent
        updateMoneyDisplay(money);

        // Sauvegarde le nouveau montant d'argent dans le localStorage
        saveMoney(money);

        // Met à jour la date du dernier calcul d'argent dans le localStorage
        localStorage.setItem('lastCalculatedDate', formattedDate);
    } else {
        console.log("Pas de nouvelles habitudes ou argent déjà calculé pour aujourd'hui.");
        updateMoneyDisplay(money);
    }

    // Charge l'état du personnage à partir du localStorage
    loadCharacterState();

    // Charge la garde-robe à partir du localStorage
    loadWardrobe();
});

function updateMoneyDisplay(money) {
    // Met à jour le texte affiché de l'élément avec l'id 'money' avec le nouveau montant d'argent
    document.getElementById('money').textContent = money;
    console.log("Affichage de l'argent mis à jour :", money); // Affiche le montant d'argent mis à jour dans la console

    // Désactive les boutons d'achat des articles qui sont plus chers que le montant d'argent actuel
    document.querySelectorAll('.shop-item button').forEach(button => {
        // Récupère le prix de l'article depuis l'attribut data-price du bouton
        const price = parseInt(button.dataset.price, 10);
        // Désactive le bouton si l'argent est insuffisant, sinon l'active
        button.disabled = money < price;
        console.log(`Bouton pour ${button.dataset.item} : ${money < price ? 'désactivé' : 'activé'}`); // Affiche dans la console si le bouton est activé ou désactivé
    });
}

function buyItem(button) {
    // Récupère le montant d'argent actuel depuis le localStorage
    let money = parseInt(localStorage.getItem('money')) || 0;

    // Récupère le prix de l'article depuis l'attribut data-price du bouton
    const price = parseInt(button.dataset.price, 10);

    // Récupère le nom de l'article depuis l'attribut data-item du bouton
    const item = button.dataset.item;

    // Vérifie si l'utilisateur a suffisamment d'argent pour acheter l'article
    if (money >= price) {
        // Déduit le prix de l'article du montant d'argent
        money -= price;

        // Sauvegarde le nouveau montant d'argent dans le localStorage
        saveMoney(money);

        // Met à jour l'affichage du montant d'argent sur l'écran
        updateMoneyDisplay(money);

        // Récupère la garde-robe actuelle depuis le localStorage
        let wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};

        // Ajoute l'article à la garde-robe de l'utilisateur
        wardrobe[item] = true;

        // Sauvegarde la nouvelle garde-robe dans le localStorage
        localStorage.setItem('wardrobe', JSON.stringify(wardrobe));

        // Affiche un message dans la console indiquant que l'article a été acheté
        console.log(`Article acheté : ${item}`);

        // Recharge la garde-robe pour refléter l'achat effectué
        loadWardrobe();
    } else {
        // Si l'utilisateur n'a pas assez d'argent, affiche un message dans la console
        console.log("Pas assez d'argent pour acheter cet article.");
    }
}

// Ajoute un événement 'click' à chaque bouton d'article du magasin
document.querySelectorAll('.shop-item button').forEach(button => {
    button.addEventListener('click', function() {
        // Appelle la fonction buyItem lorsque le bouton est cliqué
        buyItem(button);
    });
});

function saveMoney(money) {
    // Sauvegarde le montant d'argent actuel dans le localStorage
    localStorage.setItem('money', money);
    console.log("Argent sauvegardé :", money); // Affiche un message dans la console indiquant que l'argent a été sauvegardé
}

function saveCharacterState() {
    // Récupère la garde-robe actuelle depuis le localStorage ou initialise à un objet vide si non disponible
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};

    // Sauvegarde l'état actuel du personnage (garde-robe) dans le localStorage
    localStorage.setItem('wardrobe', JSON.stringify(wardrobe));
    console.log("État du personnage sauvegardé :", wardrobe); // Affiche un message dans la console indiquant que l'état du personnage a été sauvegardé
}

function loadCharacterState() {
    // Récupère l'état actuel du personnage depuis le localStorage ou initialise à un objet vide si non disponible
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("État du personnage chargé :", wardrobe); // Affiche l'état du personnage chargé dans la console

    // Met à jour l'image du personnage en fonction de l'état actuel de la garde-robe
    updateCharacterImage(wardrobe);
}

function loadWardrobe() {
    // Récupère la garde-robe actuelle depuis le localStorage ou initialise à un objet vide si non disponible
    const wardrobe = JSON.parse(localStorage.getItem('wardrobe')) || {};
    console.log("Garde-robe chargée :", wardrobe); // Affiche la garde-robe chargée dans la console

    // Sélectionne l'élément du DOM où les articles de la garde-robe seront affichés
    const wardrobeItemsContainer = document.getElementById('wardrobe-items');
    wardrobeItemsContainer.innerHTML = ''; // Vide le contenu actuel du conteneur de la garde-robe

    // Pour chaque type d'article (chapeau, chemise, pantalon, chaussures)
    ['hat', 'shirt', 'pants', 'shoes'].forEach(item => {
        // Crée un bouton pour chaque article
        const button = document.createElement('button');
        button.textContent = `Porter ${item}`; // Définit le texte du bouton
        button.dataset.item = item; // Définit l'attribut data-item avec le nom de l'article
        button.classList.add('wardrobe-item'); // Ajoute la classe CSS 'wardrobe-item' au bouton

        // Si l'article est actuellement porté (présent dans la garde-robe)
        if (wardrobe[item]) {
            button.classList.add('selected'); // Ajoute la classe CSS 'selected' au bouton
        }

        // Ajoute un gestionnaire d'événement pour le clic sur le bouton
        button.addEventListener('click', () => {
            wardrobe[item] = !wardrobe[item]; // Inverse l'état de l'article (le porter ou non)
            saveCharacterState(); // Sauvegarde l'état actuel du personnage
            updateCharacterImage(wardrobe); // Met à jour l'image du personnage en fonction de la garde-robe

            // Met à jour l'apparence du bouton en fonction de l'état actuel de l'article
            if (wardrobe[item]) {
                button.classList.add('selected');
            } else {
                button.classList.remove('selected');
            }
        });

        // Ajoute le bouton au conteneur de la garde-robe dans le DOM
        wardrobeItemsContainer.appendChild(button);
    });
}

function updateCharacterImage(wardrobe) {
    // Définit l'image par défaut du personnage
    let imageSrc = 'assets/default.png';

    // Modifie l'image du personnage en fonction des articles portés
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

    // Met à jour l'élément d'image du personnage avec la nouvelle source d'image
    document.getElementById('character').src = imageSrc;
    console.log("Image du personnage mise à jour :", imageSrc); // Affiche la nouvelle source d'image dans la console
}

// Gestionnaire d'événement pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    // Sélectionne la barre latérale et le bouton de menu
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');

    // Bascule l'état actif de la barre latérale et du bouton de menu (afficher/masquer)
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});
