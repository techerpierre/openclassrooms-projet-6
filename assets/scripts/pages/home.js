import { Edition } from "../authentication/edition.js"
import { Login } from "../authentication/login.js"

new Edition([
    {
        id: "editionBanner",
        defaultDisplay: "block",
        displayOnEdition: true,
    },
    {
        id: "filters",
        defaultDisplay: "flex",
        displayOnEdition: false,
    },
    {
        id: "openWorkEditor",
        defaultDisplay: "flex",
        displayOnEdition: true,
    },
    {
        id: "goToLogin",
        defaultDisplay: "block",
        displayOnEdition: false,
    },
    {
        id: "logout",
        defaultDisplay: "block",
        displayOnEdition: true,
    }
])

document.getElementById("openWorkEditor").addEventListener("click", () => {
    document.querySelector("work-editor").setAttribute("display", "open")
})

document.getElementById("logout").addEventListener("click", () => Login.logout())
