// JavaScript pour le menu hamburger
document.getElementById('menuToggle').addEventListener('click', function() {
    var sidebar = document.getElementById('sidebar');
    var menuToggle = document.getElementById('menuToggle');
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

document.addEventListener('click', function(event) {
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');

  // Si le menu est ouvert et qu'on clique en dehors du menu ET du bouton
  if (
    sidebar.classList.contains('active') &&
    !sidebar.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    sidebar.classList.remove('active');
    menuToggle.classList.remove('active'); // si tu fais aussi une anim sur le bouton
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function (registration) {
        console.log("✅ Service Worker enregistré avec succès :", registration.scope);
      })
      .catch(function (error) {
        console.log("❌ Échec de l'enregistrement du Service Worker :", error);
      });
  });
}
