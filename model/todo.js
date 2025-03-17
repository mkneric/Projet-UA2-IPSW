import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fonction de validation des entrées
const validateTodoData = (description) => {
    if (!description || typeof description !== "string" || description.trim().length < 5) {
        throw new Error("La description est invalide. Elle doit contenir au moins 5 caractères.");
    }
};

// Ajouter une tâche
export const addTodo = async (description, priorite, date_limite, statut = "À faire") => {
    try {
        validateTodoData(description);

        const todo = await prisma.todo.create({
            data: { 
                description, 
                priorite, 
                date_limite: date_limite ? new Date(date_limite) : null, 
                statut 
            },
        });
        return todo;
    } catch (error) {
        console.error("Erreur lors de l'ajout d'une tâche:", error);
        throw new Error(error.message || "Impossible d'ajouter la tâche.");
    }
};

// Obtenir toutes les tâches
export const getTodos = async () => {
    return await prisma.todo.findMany();
};

// Obtenir une tâche spécifique par ID
export const getTodoById = async (id) => {
    if (!id || isNaN(parseInt(id))) throw new Error("ID requis et valide.");
    return await prisma.todo.findUnique({ where: { id: parseInt(id) } });
};

// Mettre à jour une tâche
export const updateTodo = async (id, data) => {
    try {
        if (!id || isNaN(parseInt(id))) throw new Error("ID invalide.");
        if (data.description || data.priorite || data.date_limite) {
            validateTodoData(data.description, data.priorite, data.date_limite);
        }

        const todo = await prisma.todo.update({
            where: { id: parseInt(id) },
            data,
        });

        await prisma.historique.create({
            data: {
                todoId: id,
                modification: `Mise à jour: ${JSON.stringify(data)}`,
            },
        });

        return todo;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche:", error);
        throw new Error(error.message || "Impossible de mettre à jour la tâche.");
    }
};

// Mettre à jour uniquement le statut d'une tâche
export const updateTodoStatus = async (id, statut) => {
    try {
        if (!id || isNaN(parseInt(id))) throw new Error("ID invalide.");
        const validStatuses = ["À faire", "En cours", "En révision", "Terminée"];
        if (!validStatuses.includes(statut)) throw new Error("Statut invalide.");

        const todo = await prisma.todo.update({
            where: { id: parseInt(id) },
            data: { statut },
        });

        await prisma.historique.create({
            data: {
                todoId: id,
                modification: `Statut changé à ${statut}`,
            },
        });

        return todo;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        throw new Error(error.message || "Impossible de mettre à jour le statut.");
    }
};

// Supprimer une tâche
export const deleteTodo = async (id) => {
    try {
        if (!id || isNaN(parseInt(id))) throw new Error("ID invalide.");
        await prisma.historique.deleteMany({ where: { todoId: parseInt(id) } });
        return await prisma.todo.delete({ where: { id: parseInt(id) } });
    } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
        throw new Error(error.message || "Impossible de supprimer la tâche.");
    }
};

// Filtrer les tâches par statut
export const getTodosByStatus = async (statut) => {
    return await prisma.todo.findMany({ where: { statut } });
};

// Filtrer les tâches par priorité
export const getTodosByPriority = async (priorite) => {
    return await prisma.todo.findMany({ where: { priorite } });
};

// Trier les tâches par date
export const getTodosSorted = async (tri) => {
    if (!["date_limite", "id"].includes(tri)) {
        throw new Error("Tri invalide. Utiliser 'date_limite' ou 'id'.");
    }
    return await prisma.todo.findMany({ orderBy: { [tri]: "asc" } });
};

// Obtenir l'historique des modifications d'une tâche
export const getTodoHistory = async (id) => {
    if (!id || isNaN(parseInt(id))) throw new Error("ID requis et valide.");
    return await prisma.historique.findMany({ where: { todoId: parseInt(id) } });
};