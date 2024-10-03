import { Api } from "../api/api.js"
import { Cookies } from "../authentication/cookies.js";
import { CUSTOM_ERRORS_CODES, CustomError } from "../errors/custom_errors.js";
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
                                <button class="work-editor-delete-show-modal">
                                    <img src="./assets/icons/bin.png" alt="bin icon"/>
                                </button>
                                <div class="work-editor-delete-modal">
                                    <button>Supprimer</button>
                                </div>
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
        <h3>Ajouter photo</h3>
        <form id="createNewWorkForm" class="work-editor-create-content">
            <${File.baliseName} name="file"></${File.baliseName}>
            <div class="work-editor-create-fields">
                <label htmlFor="title">Titre</label>
                <input type="text" id="title" name="title"/>
                <label htmlFor="category">Catégorie</label>
                <input type="text" id="category" name="category" list="suggestions" autocomplete="off"/>
                <datalist id="suggestions">
                    ${this.categories ? this.categories.map(category => /*html*/`
                        <option value="${category.name}"></option>
                    `).join("") : ""}
                </datalist>
                <div class="separator"></div>
                <input type="submit" value="Valider" class="create-work-form-btn disabled"/>
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

            const deleteModal = work.querySelector(".work-editor-delete-modal")

            work.querySelector(".work-editor-delete-show-modal").addEventListener("click", (e) => {
                e.preventDefault()
                
                deleteModal.classList.add("show")
            })

            deleteModal.addEventListener("click", (e) => {
                if (e.target === e.currentTarget) {
                    deleteModal.classList.remove("show")
                }
            })

            deleteModal.querySelector("button").addEventListener("click", (e) => {
                e.preventDefault()

                this.api.DeleteWork(work.getAttribute("data-id"), Cookies.getCookie("token"))
                    .catch(e => {
                        if (e instanceof CustomError) {
                            const errorPopup = document.getElementById("errorPopup")
                            errorPopup.addError(e.message)
                        }
                    })
                const galleryItem = document.querySelectorAll(`#gallery ${WorkCard.baliseName}`)[index]
                if (galleryItem)
                    galleryItem.remove()
                work.remove()
            })
        })
    }

    setCreateEvents() {
        const switchToDeleteButton = this.querySelector("#workEditorSwitchToDeleteWork")
        const createNewWorkForm = this.querySelector("#createNewWorkForm")
        const errorPopup = document.getElementById("errorPopup")

        switchToDeleteButton.addEventListener("click", () => {
            this.setAttribute("view", "delete")
        })

        createNewWorkForm.addEventListener("submit", (e) => {
            e.preventDefault()
            
            const image = e.target["file"].files[0];
            const title = e.target["title"].value;
            const category = e.target["category"].value;            

            if (!image || !title || !category) {
                errorPopup.addError(new CustomError(CUSTOM_ERRORS_CODES.FIELD_MISSING_IN_WORK_CREATION_FORM).message)
                return
            }

            const selectedCategory = this.categories.find(el => el.name.toLowerCase() === category.toLowerCase())
            if (!selectedCategory) {
                errorPopup.addError(new CustomError(CUSTOM_ERRORS_CODES.SPECIFED_WORK_CATEGORY_NOT_EXIST).message)
                return
            }

            const categoryId = selectedCategory.id
            
            const data = new FormData()
            data.append("image", image)
            data.append("title", title)
            data.append("category", categoryId)

            this.api.CreateWork(data, localStorage.getItem("token")).then(result => {
                const gallery = document.querySelector("#gallery > div")
                gallery.innerHTML += /*html*/`
                    <${WorkCard.baliseName} src="${result.imageUrl}" alt="${result.title}" title="${result.title}"></${WorkCard.baliseName}>
                `

                this.works.push(result)

                this.setAttribute("view", "delete")
                this.setAttribute("display", "close")
            }).catch(e => {
                if (e instanceof CustomError) {
                    errorPopup.addError(e.message)
                }
            })
        })

        const isFieldFilled = { image: false, title: false, category: false }

        createNewWorkForm.addEventListener("change", (event) => {
            if (event.target.name === "file") {
                if (event.target.files.length > 0) {
                    isFieldFilled.image = true
                } else {
                    isFieldFilled.image = false
                }
            }
            isFieldFilled[event.target.name] = (event.target.value !== "")

            const createWorkBtn = this.querySelector(".create-work-form-btn")
            if (isFieldFilled.image && isFieldFilled.title && isFieldFilled.category) {
                createWorkBtn.classList.remove("disabled")
            } else {
                createWorkBtn.classList.add("disabled")
            }
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
