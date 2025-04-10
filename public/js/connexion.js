let inputCourriel = document.getElementById("input-courriel");
let inputMotDePasse = document.getElementById("input-mot-de-passe");
let formConnexion = document.getElementById("form-connexion");

formConnexion.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Les noms des variables doivent être les mêmes
    // que celles spécifié dans les configuration de
    // passport dans le fichier "authentification.js"
    const data = {
        email: inputCourriel.value,
        password: inputMotDePasse.value,
    };

    let response = await fetch("/connexion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        window.location.replace("/");
    } else {
        let data = await response.json();

        const message = data.erreur === "mauvais_utilisateur"
            ? "Adresse courriel inconnue"
            : data.erreur === "mauvais_mot_de_passe"
                ? "Mot de passe incorrect"
                : "Échec de connexion. Vérifiez vos identifiants.";

        alert(message); // ou afficher dans un <div id="error-message">...</div>
    }

});
