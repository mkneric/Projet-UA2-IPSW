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
        styles: ["/css/main.css", "/css/tableau.css", "/css/modalajout.css"],
        scripts: ["/js/main.js", "/js/script.js"],
        todos: await getTodos(),
    });
});

// Routes API pour la gestion des tâches

// Ajouter une tâche
router.post("/api/todo", async (request, response) => {
    const { description, priorite, date_limite } = request.body;
    try {
        const todo = await addTodo(description, priorite, date_limite);
        response.status(200).json({ todo, message: "Tâche ajoutée avec succès" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

// Obtenir toutes les tâches
router.get("/api/todos", async (request, response) => {
    try {
        const todos = await getTodos();
        response.status(200).json(todos);
    } catch (error) {
        response.status(400).json({ error: error.message });
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
        response.status(400).json({ error: error.message });
    }
});

// Mettre à jour une tâche
router.patch("/api/todo/:id", async (request, response) => {
    try {
        const todo = await updateTodo(parseInt(request.params.id), request.body);
        if (todo) {
            response.status(200).json({ todo, message: "Tâche mise à jour avec succès" });
        } else {
            response.status(404).json({ message: "Tâche non trouvée" });
        }
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

// Mettre à jour uniquement le statut d'une tâche
router.patch("/api/todo/:id/status", async (request, response) => {
    try {
        const todo = await updateTodoStatus(parseInt(request.params.id), request.body.statut);
        response.status(200).json({ todo, message: "Statut mis à jour avec succès" });
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

// Supprimer une tâche
router.delete("/api/todo/:id", async (request, response) => {
    try {
        await deleteTodo(parseInt(request.params.id));
        response.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        response.status(400).json({ error: error.message });
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
        response.status(400).json({ error: error.message });
    }
});

// Obtenir l'historique des modifications d'une tâche
router.get("/api/todo/:id/historique", async (request, response) => {
    try {
        const historique = await getTodoHistory(parseInt(request.params.id));
        response.status(200).json(historique);
    } catch (error) {
        response.status(400).json({ error: error.message });
    }
});

export default router;
