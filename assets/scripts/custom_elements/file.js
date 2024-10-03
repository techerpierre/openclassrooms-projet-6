export class File extends HTMLElement {

    static baliseName = "file-preview"

    constructor() {
        super()
        this.setContent(this.getDefaultContent());
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
            <div>
                <input type="file" class="file-preview-input" name="${this.getAttribute("name")}"/>
                ${this.currentContent}
            </div>
        `
        switch(this.events) {
            case "default":
                this.setDefaultEvents()
        }
    }

    setContent(content) {
        this.currentContent = content
        this.connectedCallback()
    }

    getDefaultContent() {
        this.events = "default"
        return /*html*/`
            <div class="file-preview">
                <img src="./assets/icons/placeholder.png" alt="image placeholder">
                <button class="add-file-button">+ Ajouter photo</button>
                <small>jpg, png : 4mo max</small>
            </div>
        `
    }

    getSelectedContent(src) {
        this.events = "selected"
        return /*html*/`
            <div class="file-preview no-padding">
                <img class="file-preview-image" src="${src}" alt="">
            </div>
        `
    }

    setDefaultEvents() {
        const filePreviewInput = this.querySelector(".file-preview-input")
        const selectFileButton = this.querySelector(".add-file-button")
        selectFileButton.addEventListener("click", (e) => {
            e.preventDefault()
            filePreviewInput.click()
        })

        filePreviewInput.addEventListener("change", (event) => {
            const file = event.target.files[0]

            if (file) {
                const reader = new FileReader()

                reader.onload = (event) => {
                    const src = event.target.result
                    this.setContent(this.getSelectedContent(src))
                }
                
                reader.readAsDataURL(file);
            }
        })
    }

    

}