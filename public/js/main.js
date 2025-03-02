// Exécuter le script une fois le DOM entièrement chargé
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script chargé et exécuté !");

    // Recupération des éléments du DOM
    const todoForm = document.getElementById("todo-form");
    const todoInput = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
    const todoTemplate = document.getElementById("todo-template");

    if (!todoForm || !todoInput || !todoList || !todoTemplate) {
        console.error("Un ou plusieurs éléments sont introuvables dans le DOM !");
        return;
    }

    // Mettre à jour une tâche
    const updateTask = async (event) => {
        await fetch(`/api/todo/${event.target.parentElement.dataset.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
        });
    };

    // Ajouter une tâche au client
    const addTodoToClient = (tache) => {
        let todoElement = todoTemplate.content.firstElementChild.cloneNode(true);

        let checkbox = todoElement.querySelector("input[type=checkbox]");
        todoElement.querySelector(".description").innerText = tache.description;

        todoElement.dataset.id = tache.id;

        checkbox.checked = tache.est_faite;
        checkbox.addEventListener("change", updateTask);

        todoList.appendChild(todoElement);
        todoInput.value = "";
    };

    // Envoyer une requête POST au serveur pour ajouter une tâche
    const addTodoToServer = async (event) => {
        event.preventDefault();

        const data = { description: todoInput.value };

        const response = await fetch("/api/todo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const responseData = await response.json();
            addTodoToClient(responseData.todo);
        } else {
            console.error("Réponse du serveur : ", response.status);
        }
    };

    // Obtenir la liste des tâches au chargement
    const getTodos = async () => {
        const response = await fetch("/api/todos");
        if (response.ok) {
            const todos = await response.json();
            todos.forEach((todo) => {
                addTodoToClient(todo);
            });
        } else {
            console.error("Réponse du serveur : ", response.status);
        }
    };

    // Ajouter un event listener sur le formulaire
    if (todoForm) {
        todoForm.addEventListener("submit", (event) => {
            event.preventDefault();
            addTodoToServer(event);
        });
    }

    // Écouter dynamiquement les changements des checkboxes
    document.addEventListener("change", (event) => {
        if (event.target.matches("input[type=checkbox]")) {
            updateTask(event);
        }
    });

    // Charger les tâches à l'ouverture de la page
    getTodos();
});
