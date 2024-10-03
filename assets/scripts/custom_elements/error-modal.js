export class ErrorModal extends HTMLElement {
    
    static baliseName = "error-popup"

    errors = []

    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
            <div class="error-modal-container"></div>
        `

        const btnCloseElement = this.querySelectorAll(".error-modal-element")

        btnCloseElement.forEach(element => {

            const closeBtn = element.querySelector(".error-modal-close-btn")

            closeBtn.addEventListener("click", () => {
                element.remove()
            })
        })
    }

    addError(message) {
        const container = this.querySelector(".error-modal-container")

        const newErrorToast = document.createElement("div")
        newErrorToast.classList.add("error-modal-element")
        newErrorToast.innerHTML = /*html*/`
            <p>${message}</p>
            <span class="error-modal-close-btn">x</span>
        `

        const closeBtn = newErrorToast.querySelector(".error-modal-close-btn")
        closeBtn.addEventListener("click", () => {
            newErrorToast.remove()
        })

        container.appendChild(newErrorToast)

        setTimeout(() => {
            newErrorToast.remove()
        }, 6000)
    }

}