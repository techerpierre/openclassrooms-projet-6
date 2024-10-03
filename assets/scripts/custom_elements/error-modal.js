export class ErrorModal extends HTMLElement {
    
    static baliseName = "error-popup"

    errors = []

    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
            <div class="error-modal-container">
                ${this.errors.map((message, index) => /*html*/`
                    <div class="error-modal-element">
                        <p data-index="${index}">${message}</p>
                        <span class="error-modal-close-btn">x</span>
                    </div>
                `).join()}
            </div>
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
        const index = this.errors.length.valueOf();

        this.errors.push(message)
        this.connectedCallback()

        setTimeout(() => {
            this.errors.pop(index)
        this.connectedCallback()
        }, 6000)
    }

}