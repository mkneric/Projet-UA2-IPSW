export const validateTaskServer = (task) => {
    if (!task.title || typeof task.title !== "string" || task.title.length < 5 || task.title.length > 50) {
        return { valid: false, message: "Le titre est obligatoire et doit contenir entre 5 et 50 caractères." };
    }
    
    if (!task.description || typeof task.description !== "string" || task.description.length < 5 || task.description.length > 200) {
        return { valid: false, message: "La description est obligatoire et doit contenir entre 5 et 200 caractères." };
    }
    
    if (new Date(task.dueDate) < new Date()) {
        return { valid: false, message: "La date limite ne peut pas être passée." };
    }
    
    return { valid: true, message: "Tâche valide." };
};
