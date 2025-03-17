import { validateTask } from "./validation.js";

// Récupération des éléments du DOM
const todoForm = document.getElementById("form-ajouter-tache");
const titreInput = document.getElementById("titre");
const descriptionInput = document.getElementById("description");
const prioriteInput = document.getElementById("priorite");
const dateLimiteInput = document.getElementById("date-limite");
const assignationInput = document.getElementById("assignation");
const statutInput = document.getElementById("statut");

// Vérifier si le formulaire existe sur la page
if (!todoForm) {
    console.warn("Aucun formulaire trouvé sur cette page. Script arrêté.");
} else {
    // Fonction pour envoyer une requête POST au serveur pour ajouter une tâche
    const addTodoToServer = async (event) => {
        event.preventDefault();

        // Validation des champs avant soumission
        if (!validateTask()) {
            console.error("Validation échouée. Vérifiez les champs !");
            return;
        }

        // Création de l'objet à envoyer
        const data = {
            title: titreInput.value,
            description: descriptionInput.value,
            priorite: prioriteInput.value,
            date_limite: dateLimiteInput.value,
            assignation: assignationInput.value,
            statut: statutInput.value,
        };

        console.log("Données envoyées :", data); // Debugging

        try {
            // Envoi de la requête POST au serveur
            const response = await fetch("/api/todo", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Réponse du serveur :", responseData);

                // Ajouter la tâche à l'interface utilisateur
                addTodoToClient(responseData.todo);

                // Réinitialiser le formulaire
                todoForm.reset();
            } else {
                console.error("Erreur serveur :", response.status);
                const errorResponse = await response.json();
                console.error("Détails de l'erreur :", errorResponse);
            }
        } catch (error) {
            console.error("Erreur lors de l'ajout de la tâche :", error);
        }
    };

    // Ajouter un event listener sur le formulaire
    todoForm.addEventListener("submit", addTodoToServer);
}

// Fonction pour ajouter une tâche à l'interface utilisateur
const addTodoToClient = (tache) => {
    const colonneCible = document.querySelector(`.taches[data-statut="${tache.statut}"]`);

    if (!colonneCible) {
        console.error(`Impossible de trouver la colonne pour le statut : ${tache.statut}`);
        return;
    }

    // Création de la carte de la tâche
    let todoElement = document.createElement("div");
    todoElement.classList.add("todo-card");
    todoElement.dataset.id = tache.id;

    // Ajout du titre
    let titreElement = document.createElement("h3");
    titreElement.classList.add("titre-tache");
    titreElement.innerText = tache.title || "Sans titre";

    // Ajout de la priorité
    let prioriteElement = document.createElement("span");
    prioriteElement.classList.add("priorite-tache");
    prioriteElement.innerText = tache.priorite;

    // Boutons "Détails" et "Historique"
    let detailsButton = document.createElement("button");
    detailsButton.classList.add("btn-detail");
    detailsButton.innerText = "Détails";

    let historiqueButton = document.createElement("button");
    historiqueButton.classList.add("btn-historique");
    historiqueButton.innerText = "Historique";

    // Conteneur des boutons
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    buttonContainer.appendChild(detailsButton);
    buttonContainer.appendChild(historiqueButton);

    // Ajout des éléments à la carte
    todoElement.appendChild(titreElement);
    todoElement.appendChild(prioriteElement);
    todoElement.appendChild(buttonContainer);

    // Ajout de la tâche à la colonne
    colonneCible.appendChild(todoElement);
    console.log(`Tâche ${tache.id} ajoutée dans la colonne ${tache.statut}`);
};
