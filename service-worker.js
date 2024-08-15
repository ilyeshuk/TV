self.addEventListener('install', (event) => {
    console.log('Service Worker installé.');
    self.skipWaiting();  // Installe immédiatement le Service Worker
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activé.');
    event.waitUntil(self.clients.claim());  // Prend le contrôle des pages sans attendre
});

self.addEventListener('message', (event) => {
    if (event.data.action === 'startTrackingHabits') {
        startTrackingHabits();
    }
});

function startTrackingHabits() {
    setInterval(() => {
        const today = new Date();
        const day = ('0' + today.getDate()).slice(-2);
        const month = ('0' + (today.getMonth() + 1)).slice(-2);
        const year = today.getFullYear();
        const hours = ('0' + today.getHours()).slice(-2);
        const minutes = ('0' + today.getMinutes()).slice(-2);
        const seconds = ('0' + today.getSeconds()).slice(-2);

        const formattedDateWithSeconds = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        
        // Ici, on va mettre à jour habitHistoryWithSeconds
        // On peut envoyer un message à la page principale avec les nouvelles données
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'updateHabit',
                    date: formattedDateWithSeconds,
                    habitsCompleted: 0 // Exemple de données, modifiez selon vos besoins
                });
            });
        });
    }, 1000);  // Exécute la fonction toutes les secondes
}
