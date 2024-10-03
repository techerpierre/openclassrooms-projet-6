import { Cookies } from "./cookies.js"

export class Edition {

    constructor(elements) {
        this.handleElements(elements)
    }

    handleElements(elements) {
        elements.forEach(({ id, defaultDisplay, displayOnEdition }) => {
            const domElement = document.getElementById(id)
            domElement.style.display = this.getIsDisplayed(displayOnEdition)? defaultDisplay : "none"
        })
    }

    getIsDisplayed(displayOnEdition) {
        const token = Cookies.getCookie("token")
        let isDisplayed = false
        if (displayOnEdition && token) {
            //if (payloads.exp * 1000 > Date.now())
            isDisplayed = true
        }
        else if (!displayOnEdition && !token)
            isDisplayed = true
        return isDisplayed
    }
}