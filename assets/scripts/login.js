import { addErrorPopup } from "./helpers.js";

// constants
const API_DOMAIN = "http://localhost:5678/api"

// selectors
const loginForm = document.getElementById("login");
const popupContainer = document.getElementById("popupContainer");

// submit login form
loginForm.addEventListener("submit", (e) => {
    
    e.preventDefault();

    const email = e.target["email"].value;
    const password = e.target["password"].value;

    if (!email || !password) {
        addErrorPopup(popupContainer, "Les champ Email et Mot de passe doivent être remplis.");
        return;
    }

    login({ email, password }).then(data => {
        localStorage.setItem("token", data.token);
        window.location.replace("../index.html");
    }).catch(() => {
        addErrorPopup(popupContainer, "La connexion à été refusée assurez-vous que votre email ou votre mot de passe soient correctes.");
        return;
    });

});

// methodes
export async function login(payloads) {

    const response = await fetch(API_DOMAIN + "/users/login", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify(payloads),
    });

    if (response.status != 200)
        throw new Error("Incorrect email or password.");

    return response.json();

}