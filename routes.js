import { Router } from "express";
import {
    addTodo,
    getTodos,
    getTodoById,
    updateTodo,
    updateTodoStatus,
    deleteTodo,
    getTodosByStatus,
    getTodosByPriority,
    getTodosSorted,
    getTodoHistory
} from "./model/todo.js";
import { validateTaskServer } from "./validation.js";

const router = Router();

// Routes de l'interface utilisateur (Frontend) 
router.get("/", async (request, response) => {
    response.render("index", {
        titre: "Accueil",
        styles: ["/css/main.css", "/css/style.css"],
        scripts: ["/js/main.js"],
        todos: await getTodos(),
    });
});

router.get("/contact", (request, response) => {
    response.render("contact", {
        titre: "Contact",
        styles: ["/css/main.css", "/css/contact.css"],
        scripts: ["/js/main.js"],
    });
});

router.get("/tableau", async (request, response) => {
    response.render("tableau", {
        titre: "Tableau de Bord",
        styles: ["/css/main.css", "/css/tableau.css", "/css/modalajout.css", "/css/modaldetail.css"],
        scripts: ["/js/main.js", "/js/script.js", "/js/validation.js"],
        todos: await getTodos(),
    });
});

// Routes API pour la gestion des tâches

// Ajouter une tâche
router.post("/api/todo", async (request, response) => {
    // Vérification des données envoyées par le frontend
    const validation = validateTaskServer(request.body);
    if (!validation.valid) {
        return response.status(400).json({ error: validation.message });
    }

    try {
        const { title, description, priorite, date_limite, assignation, statut } = request.body;

        // Ajout de la tâche avec le statut sélectionné
        const todo = await addTodo(description, priorite, date_limite, statut);
        response.status(200).json({ todo, message: "Tâche ajoutée avec succès" });
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de l'ajout de la tâche." });
    }
});

// Obtenir toutes les tâches
router.get("/api/todos", async (request, response) => {
    try {
        const todos = await getTodos();
        response.status(200).json(todos);
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la récupération des tâches." });
    }
});

// Obtenir une tâche par ID
router.get("/api/todo/:id", async (request, response) => {
    try {
        const todo = await getTodoById(parseInt(request.params.id));
        if (todo) {
            response.status(200).json(todo);
        } else {
            response.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la récupération de la tâche." });
    }
});

// Mettre à jour une tâche
router.patch("/api/todo/:id", async (request, response) => {
    const validation = validateTaskServer(request.body);
    if (!validation.valid) {
        return response.status(400).json({ error: validation.message });
    }
    
    try {
        const todo = await updateTodo(parseInt(request.params.id), request.body);
        if (todo) {
            response.status(200).json({ todo, message: "Tâche mise à jour avec succès" });
        } else {
            response.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la mise à jour de la tâche." });
    }
});

// Mettre à jour uniquement le statut d'une tâche
router.patch("/api/todo/:id/status", async (request, response) => {
    try {
        const todo = await updateTodoStatus(parseInt(request.params.id), request.body.statut);
        response.status(200).json({ todo, message: "Statut mis à jour avec succès" });
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la mise à jour du statut." });
    }
});

// Supprimer une tâche
router.delete("/api/todo/:id", async (request, response) => {
    try {
        await deleteTodo(parseInt(request.params.id));
        response.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la suppression de la tâche." });
    }
});

// Routes de filtrage et tri des tâches 
router.get("/api/todos", async (request, response) => {
    try {
        if (request.query.statut) {
            return response.status(200).json(await getTodosByStatus(request.query.statut));
        }
        if (request.query.priorite) {
            return response.status(200).json(await getTodosByPriority(request.query.priorite));
        }
        if (request.query.tri) {
            return response.status(200).json(await getTodosSorted(request.query.tri));
        }
        response.status(200).json(await getTodos());
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors du filtrage des tâches." });
    }
});

// Obtenir l'historique des modifications d'une tâche
router.get("/api/todo/:id/historique", async (request, response) => {
    try {
        const historique = await getTodoHistory(parseInt(request.params.id));
        response.status(200).json(historique);
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la récupération de l'historique." });
    }
});

export default router;
