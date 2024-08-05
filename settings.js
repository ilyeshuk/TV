// theme-chooser.js

document.addEventListener('DOMContentLoaded', () => {
    const themeForm = document.getElementById('theme-form');
    const themeSelect = document.getElementById('theme');
    const backgroundImageInput = document.getElementById('background-image');

    // Charger les préférences depuis localStorage
    const savedTheme = localStorage.getItem('theme');
    const savedBackgroundImage = localStorage.getItem('backgroundImage');

    if (savedTheme) {
        document.body.classList.add(`theme-${savedTheme}`);
        themeSelect.value = savedTheme;
    }

    if (savedBackgroundImage) {
        document.body.style.backgroundImage = `url(${savedBackgroundImage})`;
    }

    // Gérer la soumission du formulaire
    themeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const theme = themeSelect.value;
        const file = backgroundImageInput.files[0];

        // Appliquer le thème
        document.body.classList.remove('theme-default', 'theme-dark', 'theme-light');
        document.body.classList.add(`theme-${theme}`);

        // Appliquer l'image de fond
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.body.style.backgroundImage = `url(${e.target.result})`;
                localStorage.setItem('backgroundImage', e.target.result);
            }
            reader.readAsDataURL(file);
        } else {
            document.body.style.backgroundImage = '';
            localStorage.removeItem('backgroundImage');
        }

        // Sauvegarder le thème dans localStorage
        localStorage.setItem('theme', theme);
    });
});
