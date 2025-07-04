if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
        console.log('Service Worker enregistré avec succès.');
    })
    .catch(function(error) {
        console.error('Erreur lors de l\'enregistrement du Service Worker :', error);
    });
}
