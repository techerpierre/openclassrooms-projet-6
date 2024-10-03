export class Filter extends HTMLElement {
    static baliseName = "filter-button"

    constructor() {
        super()
        this.addEventListener("click", this.onCLickEvent)
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
            <button>${ this.textContent || "" }</button>
        `
    }

    onCLickEvent(e) {
        e.preventDefault()
        const listId = this.getAttribute("list")

        const parent = this.getAttribute("parent")
        
        if (parent) {
            const filters = document.querySelectorAll(`#${parent} ${Filter.baliseName}`)

            filters.forEach(filter => {
                filter.setAttribute("active", "false")
            })
        }

        if (listId) {
            const list = document.getElementById(listId)
    
            list.setAttribute("filter-value", this.getAttribute("filter-value"))
            this.setAttribute("active", "true")
        }
    }
}