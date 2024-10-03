export class EditionBanner extends HTMLElement {

    static baliseName = "edition-banner"

    constructor() {
        super()
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
            <div>
                <img src="/assets/icons/edit-white.png" alt="edit icon"/>
                <span>Mode édition</span>
            </div>
        `
    }
}