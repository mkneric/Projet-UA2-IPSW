document.addEventListener("DOMContentLoaded", () => {
    console.log("Script chargé et exécuté !");

    // Sélection des modales et overlay
    let modalAjout = document.getElementById("modal-ajouter-tache");
    let modalDetail = document.getElementById("modal-detail");
    let modalHistorique = document.getElementById("modal-historique");
    let overlay = document.getElementById("modal-overlay");

    // Vérification des modales
    if (!modalAjout || !modalDetail || !modalHistorique || !overlay) {
        console.error("Une des modales ou l'overlay est introuvable !");
        return;
    }

    function openPopup(modal) {
        console.log(`Ouverture de la popup : ${modal.id}`);
        modal.style.display = "flex";
        overlay.style.display = "block";
        document.body.classList.add("modal-open");
    }

    function closePopup() {
        console.log("Fermeture de toutes les popups !");
        modalAjout.style.display = "none";
        modalDetail.style.display = "none";
        modalHistorique.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    // Gestion des boutons
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("ajouter-tache")) {
            openPopup(modalAjout);
        }
        if (event.target.classList.contains("btn-detail")) {
            openPopup(modalDetail);
        }
        if (event.target.classList.contains("btn-historique")) {
            openPopup(modalHistorique);
        }
        if (event.target.classList.contains("close") || event.target === overlay) {
            closePopup();
        }
    });
});
