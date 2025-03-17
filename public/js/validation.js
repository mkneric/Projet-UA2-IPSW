const inputTitle = document.getElementById("titre");
const inputDescription = document.getElementById("description");
const inputDueDate = document.getElementById("date-limite");
const inputAssignation = document.getElementById("assignation");
const errorTitle = document.getElementById("error-titre");
const errorDescription = document.getElementById("error-description");
const errorDueDate = document.getElementById("error-date-limite");
const errorAssignation = document.getElementById("error-assignation");

export const validateTitle = () => {
    if (!inputTitle.value) {
        errorTitle.innerHTML = "Le titre est obligatoire.";
        return false;
    }
    if (inputTitle.value.length < 5 || inputTitle.value.length > 50) {
        errorTitle.innerHTML = "Le titre doit avoir entre 5 et 50 caractères.";
        return false;
    }
    errorTitle.innerHTML = "";
    return true;
};

export const validateDescription = () => {
    if (!inputDescription.value) {
        errorDescription.innerHTML = "La description est obligatoire.";
        return false;
    }
    if (inputDescription.value.length < 5 || inputDescription.value.length > 200) {
        errorDescription.innerHTML = "La description doit avoir entre 5 et 200 caractères.";
        return false;
    }
    errorDescription.innerHTML = "";
    return true;
};

export const validateDueDate = () => {
    const dueDate = new Date(inputDueDate.value);
    const now = new Date();
    if (!inputDueDate.value) {
        errorDueDate.innerHTML = "La date limite est obligatoire.";
        return false;
    }
    if (dueDate < now) {
        errorDueDate.innerHTML = "La date limite ne peut pas être passée.";
        return false;
    }
    errorDueDate.innerHTML = "";
    return true;
};

export const validateAssignation = () => {
    if (inputAssignation.value.length > 100) {
        errorAssignation.innerHTML = "L'assignation ne doit pas dépasser 100 caractères.";
        return false;
    }
    errorAssignation.innerHTML = "";
    return true;
};

export const validateTask = () => {
        return validateTitle() && validateDescription() && validateDueDate()  && validateAssignation();
    
};
