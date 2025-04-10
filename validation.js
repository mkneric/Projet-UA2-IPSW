// Validation des champs pour la création d'une tâche

export const validateTaskServer = (task) => {
    // Vérifie que le titre est une chaîne entre 5 et 50 caractères
    if (!task.title || typeof task.title !== "string" || task.title.length < 5 || task.title.length > 50) {
        return { valid: false, message: "Le titre est obligatoire et doit contenir entre 5 et 50 caractères." };
    }

    // Vérifie que la description est une chaîne entre 5 et 200 caractères
    if (!task.description || typeof task.description !== "string" || task.description.length < 5 || task.description.length > 200) {
        return { valid: false, message: "La description est obligatoire et doit contenir entre 5 et 200 caractères." };
    }

    // Vérifie que la date limite n’est pas dans le passé
    if (new Date(task.dueDate) < new Date()) {
        return { valid: false, message: "La date limite ne peut pas être passée." };
    }

    return { valid: true, message: "Tâche valide." };
};


// Validation de la description simple 
export const isDescriptionValid = (description) =>
    description &&
    typeof description === "string" &&
    description.length >= 5 &&
    description.length <= 50;


// Validation du courriel utilisateur (connexion / inscription)
export const isEmailValid = (email) =>
    email &&
    typeof email === "string" &&
    email.length >= 5 &&
    email.length <= 50 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


// Validation du mot de passe utilisateur
export const isPasswordValid = (password) =>
    password &&
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 16;
