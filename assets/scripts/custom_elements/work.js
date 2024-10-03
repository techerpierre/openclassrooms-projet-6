import { Api } from "../api/api.js"
import { CustomError } from "../errors/custom_errors.js";
import { File } from "./file.js"

export class WorkCard extends HTMLElement {

    static baliseName = "work-card"

    constructor() {
        super();
        this.src = this.getAttribute("src");
        this.alt = this.getAttribute("alt");
        this.title = this.getAttribute("title") || "Empty Work";
    }

    connectedCallback() {
        this.innerHTML = /*html*/ `
            <figure>
				<img src="${this.src}" alt="${this.alt}">
				<figcaption>${this.title}</figcaption>
			</figure>
        `;
    }
}

export class WorkList extends HTMLElement {

    static baliseName = "work-list"

    constructor() {
        super()
        this.api = new Api()
        this.api.GetWorks().then((data) => {
            this.works = data
            this.connectedCallback()
        }).catch(e => {
            if (e instanceof CustomError) {
                const errorPopup = document.getElementById("errorPopup")
                errorPopup.addError(e.message)
            }
        })

        this.category = this.getAttribute("filter-value")
    }

    connectedCallback() {
        if (!this.works) return;
        this.innerHTML = /*html*/ `
                <div>
                ${this.works
                .filter((item) => this.category && this.category !== "null" ? item.category.id == this.category : true)
                .map(
                    (work) => /*html*/ `
                        <${WorkCard.baliseName} src="${work.imageUrl}" alt="${work.title}" title="${work.title}"></${WorkCard.baliseName}>
                    `
                )
                .join("")}
                </div>
            `;
    }

    // note: static get pour faire une methode accessible depuis la class et non l'instance de class.
    // cette methode return les filtres dont l'update doit etre surveillé.
    static get observedAttributes() {
        return ["filter-value"]
    }

    attributeChangedCallback(name, _, newValue) {
        switch (name) {
            case "filter-value":
                this.category = newValue
                this.connectedCallback()
                break
        }
    }
}

export class WorkEditor extends HTMLElement {

    static baliseName = "work-editor"

    constructor() {
        super()

        this.api = new Api()
        this.getWorksData()
        this.getCategories()
        this.switchView(this.getAttribute("view"))
    }

    connectedCallback() {
        this.innerHTML = /*html*/`
            <section>
                <div class="work-editor-container">
                    ${this.currentView}
                </div>
            </section>
        `
        switch(this.getAttribute("view")) {
            case "delete":
                this.setDeleteEvents()
                break
            case "create":
                this.setCreateEvents()
                break
        }

        this.querySelector("#workEditorCloseModal").addEventListener("click", () => {
            this.setAttribute("view", "delete")
            this.setAttribute("display", "close")
        })
        this.querySelector("section").addEventListener("click", (e) => {
            if (e.target === e.currentTarget)
                this.setAttribute("display", "close")
        })
    }

    switchView(view) {
        switch(view) {
            case "delete":
                this.currentView = this.getDeleteView()
                break
            case "create":
                this.currentView = this.getCreateView()
                break
            default:
                throw new Error(
                    "Error in work.js: the view argument in the " + WorkEditor.baliseName 
                    + " balise must be delete or create but it is " + view + "."
                )
        }
    }

    getDeleteView() {        
        return /*html*/`
            <div class="work-editor-header">
                <button id="workEditorCloseModal">
                    <img src="./assets/icons/close.png"/>
                </button>
            </div>
            <h3>Galerie photo</h3>
            <div class="work-editor-delete-content">
                ${this.works ? this.works.map(
                    (work) => /*html*/`
                            <div class="work-editor-delete-item" data-id="${work.id}">
                                <img src="${work.imageUrl}" alt="${work.title}"/>
                                <button>
                                    <img src="./assets/icons/bin.png" alt="bin icon"/>
                                </button>
                            </div>
                        `
                ).join("") : "Aucune ressources"}
            </div>
            <div class="work-editor-separation"></div>
            <button id="workEditorSwitchToAddWorkButton">Ajouter une photo</button>
        `
    }

    getCreateView() {
        return /*html*/`
        <div class="work-editor-header">
            <button id="workEditorCloseModal">
                <img src="./assets/icons/close.png"/>
            </button>
            <button id="workEditorSwitchToDeleteWork">
                <img src="./assets/icons/arrow-left.png"/>
            </button>
        </div>
        <form id="createNewWorkForm" class="work-editor-create-content">
            <${File.baliseName} name="file"></${File.baliseName}>
            <div class="work-editor-create-fields">
                <label htmlFor="title">Titre</label>
                <input type="text" id="title" name="title" required/>
                <label htmlFor="category">Catégorie</label>
                <input type="text" id="category" name="category" required/>
                <span></span>
                <input type="submit" value="Valider"/>
            <div>
        </form>
        `
    }

    setDeleteEvents() {
        const switchToCreateButton = this.querySelector("#workEditorSwitchToAddWorkButton")
        
        switchToCreateButton.addEventListener("click", () => {
            this.setAttribute("view", "create")
        })

        const works = this.querySelectorAll(".work-editor-delete-item")

        works.forEach((work, index) => {

            work.querySelector("button").addEventListener("click", (e) => {

                e.preventDefault()

                this.api.DeleteWork(work.getAttribute("data-id"), localStorage.getItem("token"))
                    .catch(e => {
                        if (e instanceof CustomError) {
                            const errorPopup = document.getElementById("errorPopup")
                            errorPopup.addError(e.message)
                        }
                    })
                const galleryItem = document.querySelectorAll(`#gallery ${WorkCard.baliseName}`)[index]
                galleryItem.remove()
                work.remove()
            })
        })
    }

    setCreateEvents() {
        const switchToDeleteButton = this.querySelector("#workEditorSwitchToDeleteWork");
        const createNewWorkForm = this.querySelector("#createNewWorkForm");

        switchToDeleteButton.addEventListener("click", () => {
            this.setAttribute("view", "delete")
        })

        createNewWorkForm.addEventListener("submit", (e) => {
            e.preventDefault()

            console.log(e.target["file"].files);
            
            const image = e.target["file"].value;
            const title = e.target["title"].value;
            const category = e.target["category"].value;
            

            if (!image || !title || !category)
                throw new Error("AAAAAAhhhhh Erreeeeeeeeur !!!!!")

            const categoryId = this.categories.find(el => el.name.toLowerCase() === category.toLowerCase()).id
            
            const data = new FormData()
            data.append("image", image)
            data.append("title", title)
            data.append("category", categoryId)

            this.api.CreateWork(data, localStorage.getItem("token"))
                .catch(e => {
                    if (e instanceof CustomError) {
                        const errorPopup = document.getElementById("errorPopup")
                        errorPopup.addError(e.message)
                    }
                })
        })
    }

    getWorksData() {
        this.api.GetWorks().then(data => {
            this.works = data
            this.switchView(this.getAttribute("view"))
            this.connectedCallback()
        }).catch(e => {
            if (e instanceof CustomError) {
                const errorPopup = document.getElementById("errorPopup")
                errorPopup.addError(e.message)
            }
        })
    }

    getCategories() {
        this.api.GetCategories().then(data => {
            this.categories = data
        }).catch(e => {
            if (e instanceof CustomError) {
                const errorPopup = document.getElementById("errorPopup")
                errorPopup.addError(e.message)
            }
        })
    }

    static get observedAttributes() {
        return ["display", "view"]
    }

    attributeChangedCallback(name, _, newValue) {
        switch (name) {
            case "view":
                this.switchView(newValue)
                this.connectedCallback()
                break

            case "display":
                if (newValue === "open") {
                    document.querySelector("body").style.overflowY = "hidden"
                        this.style.display = "block"
                } else {
                    document.querySelector("body").style.overflowY = "scroll"
                    this.style.display = "none"
                }
        }
    }
}
