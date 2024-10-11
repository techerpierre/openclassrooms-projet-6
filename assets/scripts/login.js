// constants
const API_DOMAIN = "http://localhost:5678/api"

// selectors
const loginForm = document.getElementById("login");

// submit login form
loginForm.addEventListener("submit", (e) => {
    
    e.preventDefault();

    const email = e.target["email"].value;
    const password = e.target["password"].value;

    if (!email || !password)
        throw new Error("Email or Password field is empty.");

    login({ email, password }).then(data => {
        localStorage.setItem("token", data.token);
        window.location.replace("../index.html");
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