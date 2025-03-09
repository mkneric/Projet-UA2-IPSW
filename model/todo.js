import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ajouter une tâche
export const addTodo = async (description, priorite, date_limite) => {
    try {
        const todo = await prisma.todo.create({
            data: { 
                description, 
                priorite, 
                date_limite: date_limite ? new Date(date_limite) : null, 
                statut: "À faire" 
            },
        });
        return todo;
    } catch (error) {
        console.error("Erreur lors de l'ajout d'une tâche:", error);
        throw new Error("Impossible d'ajouter la tâche.");
    }
};

// Obtenir toutes les tâches
export const getTodos = async () => {
    return await prisma.todo.findMany();
};

// Obtenir une tâche spécifique par ID
export const getTodoById = async (id) => {
    if (!id) throw new Error("ID requis");
    return await prisma.todo.findUnique({ where: { id } });
};

// Mettre à jour une tâche
export const updateTodo = async (id, data) => {
    try {
        const todo = await prisma.todo.update({
            where: { id },
            data,
        });

        // Ajouter une entrée à l'historique
        await prisma.historique.create({
            data: {
                todoId: id,
                modification: `Mise à jour: ${JSON.stringify(data)}`,
            },
        });

        return todo;
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la tâche:", error);
        throw new Error("Impossible de mettre à jour la tâche.");
    }
};

// Mettre à jour uniquement le statut d'une tâche
export const updateTodoStatus = async (id, statut) => {
    try {
        const todo = await prisma.todo.update({
            where: { id },
            data: { statut },
        });

        // Ajouter une entrée à l'historique
        await prisma.historique.create({
            data: {
                todoId: id,
                modification: `Statut changé à ${statut}`,
            },
        });

        return todo;
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut:", error);
        throw new Error("Impossible de mettre à jour le statut.");
    }
};

// Supprimer une tâche
export const deleteTodo = async (id) => {
    try {
        // Supprime l'historique lié à la tâche avant de la supprimer
        await prisma.historique.deleteMany({ where: { todoId: id } });

        return await prisma.todo.delete({ where: { id } });
    } catch (error) {
        console.error("Erreur lors de la suppression de la tâche:", error);
        throw new Error("Impossible de supprimer la tâche.");
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
    return await prisma.historique.findMany({ where: { todoId: id } });
};
