document.addEventListener("DOMContentLoaded", () => {
    console.log("Script chargé et exécuté !");

    // Sélection de la modale et de l'overlay
    let modal = document.getElementById("modal-ajouter-tache");
    let overlay = document.getElementById("modal-overlay");
    let closeBtn = document.querySelector(".close");
    let cancelButton = document.querySelector(".annuler");

    // Sélection des boutons pour ouvrir la modale
    let btnAjouterTache = document.querySelector(".ajouter-tache");
    let btnAjouterColonnes = document.querySelectorAll(".ajouter"); 

    // Vérifier si la modale et l'overlay existent avant de manipuler les événements
    if (!modal || !overlay || !closeBtn || !cancelButton) {
        console.error("La modale ou l'overlay sont introuvables !");
        return;
    }

    function openPopup() {
        console.log("Ouverture de la popup !");
        modal.style.display = "flex";
        overlay.style.display = "block";
        document.body.classList.add("modal-open");
    }

    function closePopup() {
        console.log("Fermeture de la popup !");
        modal.style.display = "none";
        overlay.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    // Ajouter un événement sur "+ Ajouter une tâche"
    if (btnAjouterTache) {
        btnAjouterTache.addEventListener("click", () => {
            console.log("Click détecté sur '+ Ajouter une tâche' !");
            openPopup();
        });
    } else {
        console.error("Le bouton '+ Ajouter une tâche' est introuvable !");
    }

    // Ajouter un événement sur les boutons "+" des colonnes
    if (btnAjouterColonnes.length > 0) {
        btnAjouterColonnes.forEach(button => {
            button.addEventListener("click", () => {
                console.log("Click détecté sur un bouton '+' !");
                openPopup();
            });
        });
    } else {
        console.error("Aucun bouton '+' trouvé dans les colonnes !");
    }

    // Ajouter les événements pour fermer la modale
    closeBtn.addEventListener("click", closePopup); // Fermer avec "X"
    cancelButton.addEventListener("click", closePopup); // Fermer avec "Annuler"
});
