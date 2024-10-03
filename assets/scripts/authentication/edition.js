export class Edition {

    constructor(elements) {
        this.handleElements(elements)

        window.addEventListener("storage", (event) => {
            if (event.key == "token") {
                this.handleElements(elements)   
            }
        })
    }

    handleElements(elements) {
        elements.forEach(({ id, defaultDisplay, displayOnEdition }) => {

            const domElement = document.getElementById(id)
            domElement.style.display = this.getIsDisplayed(displayOnEdition)? defaultDisplay : "none"

        })
    }

    getIsDisplayed(displayOnEdition) {
        let isDisplayed = false
        if (displayOnEdition && localStorage.getItem("token"))
            isDisplayed = true
        else if (!displayOnEdition && !localStorage.getItem("token"))
            isDisplayed = true
        return isDisplayed
    }
}