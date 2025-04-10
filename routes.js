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
import { addUser } from "./model/user.js";
import {
    validateTaskServer,
    isEmailValid,
    isPasswordValid
} from "./validation.js";

import passport from "passport";

const router = Router();



// Middleware de vérification d'authentification
function isAuthenticated(request, response, next) {
    if (request.session.user) {
        next();
    } else {
        response.status(401).json({ error: "Vous devez être connecté" });
    }
}


// ROUTES DE PAGES PUBLIQUES

// Page d'accueil 
router.get("/", async (request, response) => {
    response.render("index", {
        titre: "Accueil",
        styles: ["/css/main.css", "/css/style.css"],
        scripts: ["/js/main.js"],
        todos: await getTodos(),
        user: request.session.user
    });
});

// Page de connexion 
router.get("/connexion", (request, response) => {
    response.render("connexion", {
        titre: "Connexion",
        styles: ["/css/main.css", "/css/style.css", "/css/connexion.css"],
        scripts: ["/js/connexion.js"],
    });
});


// ROUTES DE PAGES PROTÉGÉES 

// Page contact 
router.get("/contact", (request, response) => {
    response.render("contact", {
        titre: "Contact",
        styles: ["/css/main.css", "/css/contact.css"],
        scripts: ["/js/main.js"],
        user: request.session.user 
    });
});

// Page tableau de bord 
router.get("/tableau", isAuthenticated, async (request, response) => {
    response.render("tableau", {
        titre: "Tableau de Bord",
        styles: ["/css/main.css", "/css/tableau.css", "/css/modalajout.css", "/css/modaldetail.css"],
        scripts: ["/js/main.js", "/js/script.js", "/js/validation.js"],
        todos: await getTodos(),
        user: request.session.user
    });
});


// 👤 ROUTES D'AUTHENTIFICATION (Connexion, Déconnexion, Inscription)

// Inscription d'un nouvel utilisateur
router.post("/inscription", async (request, response) => {
    const { email, password, nom } = request.body;
    try {
        const user = await addUser(email, password, nom);
        response.status(200).json({ user, message: "Utilisateur ajouté avec succès" });
    } catch (error) {
        if (error.code === "P2002") {
            response.status(409).json({ error: "Email déjà utilisé" });
        } else {
            response.status(400).json({ error: error.message });
        }
    }
});

// Connexion d'un utilisateur existant
router.post("/connexion", (request, response, next) => {
    if (
        isEmailValid(request.body.email) &&
        isPasswordValid(request.body.password)
    ) {
        passport.authenticate("local", (erreur, user, info) => {
            if (erreur) return next(erreur);
            if (!user) return response.status(401).json(info);

            request.logIn(user, (erreur) => {
                if (erreur) return next(erreur);
                request.session.user = user;
                response.status(200).json({
                    message: "Connexion réussie",
                    user,
                });
            });
        })(request, response, next);
    } else {
        response.status(400).json({ error: "Email ou mot de passe invalide" });
    }
});

// Déconnexion de l'utilisateur
router.post("/deconnexion", (request, response, next) => {
    if (!request.session.user) {
        return response.status(401).end();
    }

    request.logOut((erreur) => {
        if (erreur) return next(erreur);
        request.session.destroy(() => {
            response.redirect("/");
        });
    });
});



// ROUTES API POUR LA GESTION DES TÂCHES (protégées)

// Ajouter une nouvelle tâche
router.post("/api/todo", isAuthenticated, async (request, response) => {
    const validation = validateTaskServer(request.body);
    if (!validation.valid) {
        return response.status(400).json({ error: validation.message });
    }

    try {
        const { title, description, priorite, date_limite, assignation, statut } = request.body;
        const todo = await addTodo(description, priorite, date_limite, statut);
        response.status(200).json({ todo, message: "Tâche ajoutée avec succès" });
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de l'ajout de la tâche." });
    }
});

// Obtenir toutes les tâches 
router.get("/api/todos", isAuthenticated, async (request, response) => {
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

// Obtenir une tâche par ID
router.get("/api/todo/:id", isAuthenticated, async (request, response) => {
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

// Mettre à jour une tâche complète
router.patch("/api/todo/:id", isAuthenticated, async (request, response) => {
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
router.patch("/api/todo/:id/status", isAuthenticated, async (request, response) => {
    try {
        const todo = await updateTodoStatus(parseInt(request.params.id), request.body.statut);
        response.status(200).json({ todo, message: "Statut mis à jour avec succès" });
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la mise à jour du statut." });
    }
});

// Supprimer une tâche
router.delete("/api/todo/:id", isAuthenticated, async (request, response) => {
    try {
        await deleteTodo(parseInt(request.params.id));
        response.status(200).json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la suppression de la tâche." });
    }
});

// Récupérer l'historique des modifications d'une tâche
router.get("/api/todo/:id/historique", isAuthenticated, async (request, response) => {
    try {
        const historique = await getTodoHistory(parseInt(request.params.id));
        response.status(200).json(historique);
    } catch (error) {
        response.status(500).json({ error: "Erreur serveur lors de la récupération de l'historique." });
    }
});

export default router;
