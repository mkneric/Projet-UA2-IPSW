import { validateTask } from "./validation.js";

// Récupération des éléments du DOM
const todoForm = document.getElementById("form-ajouter-tache");
const titreInput = document.getElementById("titre");
const descriptionInput = document.getElementById("description");
const prioriteInput = document.getElementById("priorite");
const dateLimiteInput = document.getElementById("date-limite");
const assignationInput = document.getElementById("assignation");
const statutInput = document.getElementById("statut");

// Fonction pour ajouter une tâche à l'interface utilisateur
export const addTodoToClient = (tache) => {
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

// Fonction pour récupérer et afficher les tâches enregistrées en base de données
export const loadTodosFromServer = async () => {
    try {
        const response = await fetch("/api/todos"); // Corrigé : /api/todos au lieu de /api/todo
        if (!response.ok) {
            throw new Error(`Erreur de récupération : ${response.status}`);
        }

        const todos = await response.json(); // Convertir la réponse en JSON
        console.log("Tâches chargées depuis la base :", todos);

        // Ajouter chaque tâche à l'UI
        todos.forEach(addTodoToClient);
    } catch (error) {
        console.error("Erreur lors du chargement des tâches :", error);
    }
};

// Charger les tâches dès que la page est prête
document.addEventListener("DOMContentLoaded", loadTodosFromServer);

// Fonction pour ajouter une tâche au serveur
export const addTodoToServer = async (event) => {
    event.preventDefault();

    if (!validateTask()) {
        console.error("Validation échouée !");
        return false;
    }

    const data = {
        title: titreInput.value,
        description: descriptionInput.value,
        priorite: prioriteInput.value,
        date_limite: dateLimiteInput.value,
        assignation: assignationInput.value,
        statut: statutInput.value,
    };

    console.log("Données envoyées :", data);

    try {
        const response = await fetch("/api/todo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            console.error("Erreur serveur :", response.status);
            return false;
        }

        const responseData = await response.json();
        console.log("Réponse serveur :", responseData);

        if (!responseData.todo) {
            console.error("Réponse invalide du serveur !");
            return false;
        }

        addTodoToClient(responseData.todo);

        return true;
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        return false;
    }
};

// Vérifier si le formulaire existe avant d'ajouter l'événement
if (todoForm) {
    todoForm.addEventListener("submit", addTodoToServer);
} else {
    console.warn("Aucun formulaire trouvé sur cette page. Script arrêté.");
}
