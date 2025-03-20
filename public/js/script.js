import { validateTask } from "./validation.js";
import { addTodoToServer } from "./main.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script chargé et exécuté !");

    const modalAjout = document.getElementById("modal-ajouter-tache");
    const modalDetail = document.getElementById("modal-detail");
    const modalHistorique = document.getElementById("modal-historique");
    const overlay = document.getElementById("modal-overlay");

    // Vérification de l'existence des modales
    if (!modalDetail || !modalHistorique) {
        console.error("Les modales 'Détails' et 'Historique' ne sont pas trouvées !");
        return;
    }

    // Sélection des boutons de gestion des modales
    const addTaskButtons = document.querySelectorAll(".ajouter-tache, .ajouter");
    const closeButtons = document.querySelectorAll(".close, .close-detail, .close-historique");
    const cancelButton = modalAjout?.querySelector(".annuler");
    const saveButton = modalAjout?.querySelector(".enregistrer");

    function closePopup() {
        console.log("Fermeture de toutes les fenêtres modales");
        document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
        overlay.style.display = "none";
        document.body.classList.remove("modal-open");
    }

    function openPopup() {
        console.log("Ouverture de la fenêtre Ajouter une Tâche");
        modalAjout.style.display = "flex";
        overlay.style.display = "block";
        document.body.classList.add("modal-open");
    }

    // Ajout des événements
    addTaskButtons.forEach(button => button.addEventListener("click", openPopup));
    closeButtons.forEach(button => button.addEventListener("click", closePopup));
    cancelButton?.addEventListener("click", closePopup);
    overlay.addEventListener("click", closePopup);

    saveButton?.addEventListener("click", async (event) => {
        console.log("Bouton 'Enregistrer' cliqué");

        if (!validateTask()) {
            console.error("Validation échouée : Corrigez les erreurs !");
            return;
        }

        console.log("Validation réussie, envoi des données...");
        const ajoutReussi = await addTodoToServer(event);

        if (ajoutReussi) {
            console.log("Tâche enregistrée avec succès ! Fermeture de la modale.");
            closePopup();
        } else {
            console.error("Échec de l'enregistrement, la modale reste ouverte.");
        }
    });

    // Ouverture des modales "Détails" et "Historique"
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("btn-detail")) {
            console.log("Bouton 'Détails' cliqué !");
            openModalDetail(event.target.closest(".todo-card").dataset.id);
        }
        if (event.target.classList.contains("btn-historique")) {
            console.log("Bouton 'Historique' cliqué !");
            openModalHistorique(event.target.closest(".todo-card").dataset.id);
        }
    });

    function openModalDetail(taskId) {
        console.log(`Ouverture de la modale Détails pour la tâche ID: ${taskId}`);
        modalDetail.style.display = "flex";
        overlay.style.display = "block";
        document.body.classList.add("modal-open");

        loadTaskDetails(taskId);
    }

    function openModalHistorique(taskId) {
        console.log(`Ouverture de la modale Historique pour la tâche ID: ${taskId}`);
        modalHistorique.style.display = "flex";
        overlay.style.display = "block";
        document.body.classList.add("modal-open");

        loadTaskHistory(taskId);
    }

    async function loadTaskDetails(taskId) {
        try {
            const response = await fetch(`/api/todo/${taskId}`);
            if (!response.ok) throw new Error("Erreur de récupération des détails");

            const task = await response.json();
            document.getElementById("task-id").value = taskId;
            document.getElementById("titre-detail").innerText = task.title;
            document.getElementById("description-detail").innerText = task.description;
            document.getElementById("priorite-detail").innerText = task.priorite;
            document.getElementById("date-limite-detail").innerText = new Date(task.date_limite).toISOString().split("T")[0]; // ✅ Correction du format de la date
        } catch (error) {
            console.error("Impossible de charger les détails :", error);
        }
    }

    async function loadTaskHistory(taskId) {
        try {
            const response = await fetch(`/api/todo/${taskId}/historique`);
            if (!response.ok) throw new Error("Erreur de récupération de l'historique");

            const historique = await response.json();
            document.getElementById("historique-content").innerHTML = historique.length
                ? historique.map(entry => `<p>${entry}</p>`).join("")
                : "<p>Aucune modification enregistrée.</p>";
        } catch (error) {
            console.error("Impossible de charger l'historique :", error);
        }
    }

    const modifierButton = modalDetail.querySelector(".modifier");
    const annulerButton = modalDetail.querySelector(".annuler");
    const retourButton = modalDetail.querySelector(".back-arrow");
    const supprimerButton = modalDetail.querySelector(".supprimer");
    const enregistrerButton = modalDetail.querySelector(".enregistrer");

    const detailsSection = document.getElementById("details-tache");
    const modificationSection = document.getElementById("modification-tache");

    function ouvrirModaleModification() {
        console.log("Passage à la modification de la tâche");
        detailsSection.style.display = "none";
        modificationSection.style.display = "block";

        document.getElementById("titre-modification").value = document.getElementById("titre-detail").innerText;
        document.getElementById("description-modification").value = document.getElementById("description-detail").innerText;
        document.getElementById("priorite-modification").value = document.getElementById("priorite-detail").innerText;
        document.getElementById("date-limite-modification").value = document.getElementById("date-limite-detail").innerText;
    }

    function retourModaleDetails() {
        console.log("Retour à la section détails de la tâche");
        modificationSection.style.display = "none";
        detailsSection.style.display = "block";
    }

    async function enregistrerModifications(event) {
        event.preventDefault();
        const taskId = document.getElementById("task-id").value;

        const updatedTask = {
            title: document.getElementById("titre-modification").value,
            description: document.getElementById("description-modification").value,
            priorite: document.getElementById("priorite-modification").value,
            date_limite: document.getElementById("date-limite-modification").value,
            statut: document.getElementById("statut-modification").value,
        };

        try {
            const response = await fetch(`/api/todo/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) throw new Error("Erreur de mise à jour");

            console.log(`Tâche ${taskId} mise à jour avec succès`);

            // Mise à jour de l'affichage
            loadTaskDetails(taskId);

            closePopup(); // ✅ Fermeture de la modale après modification
        } catch (error) {
            console.error("Erreur lors de la mise à jour de la tâche :", error);
        }
    }

    async function supprimerTache() {
        const taskId = document.getElementById("task-id").value;
        await fetch(`/api/todo/${taskId}`, { method: "DELETE" });
        closePopup();
        document.querySelector(`.todo-card[data-id="${taskId}"]`)?.remove();
    }

    modifierButton.addEventListener("click", ouvrirModaleModification);
    annulerButton.addEventListener("click", retourModaleDetails);
    retourButton.addEventListener("click", retourModaleDetails);
    supprimerButton.addEventListener("click", supprimerTache);
    enregistrerButton.addEventListener("click", enregistrerModifications);
});
