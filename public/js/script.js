document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script chargé !");

    const modal = document.getElementById("modal-ajouter-tache");
    const overlay = document.getElementById("modal-overlay");

    if (!modal || !overlay) {
        console.error("❌ La modale ou l'overlay n'existe pas !");
        return;
    }

    const openModalButtons = document.querySelectorAll(".ajouter-tache, .ajouter");
    console.log("✅ Boutons détectés :", openModalButtons.length);

    // 🔥 FORCER LA FERMETURE IMMÉDIATE 🔥
    modal.style.display = "none";
    overlay.style.display = "none";

    openModalButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault(); // Empêche une éventuelle redirection
            console.log("✅ Bouton cliqué !");
            modal.style.display = "flex";
            overlay.style.display = "block"; // Afficher l'overlay
            document.body.classList.add("modal-open"); // Empêche le scroll de fond
        });
    });

    // Fermer la modale
    const closeModal = document.querySelector(".modal .close");
    const cancelButton = document.querySelector(".modal .annuler");

    const closeModalFunction = () => {
        console.log("❌ Fermeture de la modale");
        modal.style.display = "none";
        overlay.style.display = "none"; // Masquer l'overlay
        document.body.classList.remove("modal-open"); // Rétablir le scroll
    };

    if (closeModal) closeModal.addEventListener("click", closeModalFunction);
    if (cancelButton) cancelButton.addEventListener("click", closeModalFunction);
    
    overlay.addEventListener("click", closeModalFunction);
});
