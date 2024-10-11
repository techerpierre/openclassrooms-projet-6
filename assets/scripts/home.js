// constants
const API_DOMAIN = "http://localhost:5678/api"

// selectors
const gallery = document.getElementById("gallery");
const filterList = document.getElementById("filters");
const filters = document.querySelectorAll("#filters > button");
const editionBanner = document.getElementById("editionBanner");
const loginLink = document.getElementById("loginLink");
const openWorkEditor = document.getElementById("openWorkEditor");
const workEditionModal = document.getElementById("workEditionModal");
const closeModalButtons = document.querySelectorAll(".close-modal-button");
const goToAddWork = document.getElementById("goToAddWork");
const deleteWorkView = document.getElementById("deleteWorkView");
const createWorkView = document.getElementById("createWorkView");
const goToDeleteWork = document.getElementById("goToDeleteWork");
const deleteWorkList = document.getElementById("deleteWorkList");
const addFileButton = document.getElementById("addFileButton");
const fileInput = document.getElementById("fileInput");
const filePreview = document.getElementById("filePreview");
const createWorkForm = document.getElementById("createWorkForm");

hideElement(workEditionModal);
hideElement(createWorkView);

// is in display mode
const isEditMode = Boolean(localStorage.getItem("token"));

// data
const works = [];
const categories = [];

// works listing
getWorks().then(data => {

    works.push(...data);

    data.forEach(element => {

        gallery.appendChild(
            createWorkCard(element),
        );

        deleteWorkList.appendChild(
            createDeleteWorkThumb(element),
        );
        
    });

    deleteWorkList.querySelectorAll(".delete-work-thumb").forEach(deleteWorkCard => {

        const workId = deleteWorkCard.getAttribute("data-work-id");

        deleteWorkCard.querySelector("button").addEventListener("click", createDeleteWorkCallback(deleteWorkCard, workId));

    });

});

getCategories().then(data => {
    categories.push(...data);
});

// display in edition mode
displayOnEditMode(
    editionBanner,
    openWorkEditor,
);

undisplayOnEditMode(
    filterList,
);

// login link redirection
handleLoginLinkRedirection();

// filters
filters.forEach(filter => {

    filter.addEventListener("click", () => {

        const categoryId = filter.getAttribute("data-category-id");

        const filteredWorks = works.filter(work => Number(categoryId) === 0 || work.category.id === Number(categoryId));

        gallery.replaceChildren(
            ...filteredWorks.map(createWorkCard),
        );

        filters.forEach(filterButton => {

            if (filterButton.getAttribute("data-category-id") === categoryId)
                filterButton.classList.add("filled");
            else
            filterButton.classList.remove("filled");

        });

    });

});

openWorkEditor.addEventListener("click", () => {

    showElement(workEditionModal);
    document.querySelector("body").style.overflowY = "hidden";
    filePreview.replaceChildren(...createEmptyFileInputPreview());
    filePreview.classList.remove("no-padding")
    document.getElementById("addFileButton").addEventListener("click", openFileSelector);

});

closeModalButtons.forEach(button => {

    button.addEventListener("click", () => closeModal());

});

goToAddWork.addEventListener("click", () => {

    hideElement(deleteWorkView);
    showElement(createWorkView);

});

goToDeleteWork.addEventListener("click", () => {

    showElement(deleteWorkView);
    hideElement(createWorkView);

});

fileInput.addEventListener("change", (e) => {

    const file = e.target.files[0];
    const imageMaxSize = 4 * 1024**2;

    if (file) {

        if (file.size > imageMaxSize)
            throw new Error("File size to over range.");

        const reader = new FileReader();

        reader.onload = (event) => {

            const src = event.target.result;

            filePreview.replaceChildren(
                createFileInputPreview(src),
            );

            filePreview.classList.add("no-padding");

        }

        reader.readAsDataURL(file);

    }

});

createWorkForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const image = e.target["image"].files[0];
    const title = e.target["title"].value;
    const category = e.target["category"].value;

    if (!image || ! title || !category)
        throw new Error("Some fields are empty.");

    const categoryId = categories.find(val => val.name === category)?.id;

    if (!categoryId)
        throw new Error("This category is not exist");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
    
    createWork(formData).then(data => {

        e.target["title"].value = "";
        e.target["category"].value = "";
        gallery.appendChild(createWorkCard(data));
        const workThumb = createDeleteWorkThumb(data);
        workThumb.querySelector("button").addEventListener("click", createDeleteWorkCallback(workThumb, data.id));
        deleteWorkList.appendChild(workThumb);
        closeModal();

    });

})

// api calls
async function getWorks() {

    const response = await fetch(API_DOMAIN + "/works");

    if (response.status !== 200)
        throw new Error("Fieled to fetch works.");

    return response.json();

}

async function deleteWork(id) {

    const response = await fetch(API_DOMAIN + "/works/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
    });

    if (response.status !== 204)
        throw new Error("Failed to delete work");

}

async function createWork(data) {

    const response = await fetch(API_DOMAIN + "/works", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: data,
    });

    if (response.status !== 201)
        throw new Error("Unable to create work.");

    return response.json();

}

async function getCategories() {

    const response = await fetch(API_DOMAIN + "/categories");

    if (response.status !== 200)
        throw new Error("Unable to get categories.");

    return response.json();

}

// methods

function createElement(tagname, attributes = {}, children = []) {

    const newElement = document.createElement(tagname);

    for (const [attribute, value] of Object.entries(attributes)) {

        if (attribute === "class") {
            newElement.classList.add(...value.split(" "));
        } else {
            newElement.setAttribute(attribute, value);
        }

    }

    if (typeof children === "string") {
        newElement.appendChild(document.createTextNode(children));
    } else {
        children.forEach(child => {
            newElement.appendChild(child);
        });
    }

    return newElement;

}

function createWorkCard(data) {
    return createElement("div", { class: "work-card", "data-work-id": data.id },
        [
            createElement("img", {
                src: data.imageUrl,
                alt: data.title,
            }),
            createElement("figcaption", {}, data.title),
        ],
    );
}

function createDeleteWorkThumb(data) {
    return createElement("div", { class: "delete-work-thumb", "data-work-id": data.id }, [
        createElement("img", { src: data.imageUrl, alt: data.title }),
        createElement("button", {}, [
            createElement("img", { src: "../../assets/icons/bin.png" }),
        ]),
    ]);
}

function createFileInputPreview(src) {
    return createElement("img", { src, alt: "uploaded image preview", class: "file-preview-image" });
}

function createEmptyFileInputPreview() {
    return [
        createElement("img", { src: "../../assets/icons/placeholder.png", alt: "image placeholder" }),
        createElement("button", { id: "addFileButton" }, "+ Ajouter photo"),
        createElement("small", {}, "jpg, png : 4mo max"),
    ];
}

function handleLoginLinkRedirection() {
    if (isEditMode) {
        loginLink.innerText = "Logout";
        loginLink.addEventListener("click", loginLinkClickCallback);
    } else {
        loginLink.innerText = "Login";
        loginLink.removeEventListener("click", loginLinkClickCallback);
    }
}

function loginLinkClickCallback(e) {

    e.preventDefault();
    localStorage.removeItem("token");
    window.location.replace("./pages/login.html");

}

function showElement(element) {
    element.classList.remove("undisplay");
}

function hideElement(element) {
    element.classList.add("undisplay");
}

function handleDisplay(condition, elements) {

    if (Array.isArray(elements)) {
        elements.forEach(element => {
            if (condition)
                showElement(element)
            else
            hideElement(element);
        });
    }

}

function displayOnEditMode(...elements) {

    handleDisplay(isEditMode, elements);

}

function undisplayOnEditMode(...elements) {

    handleDisplay(!isEditMode, elements);

}

function closeModal() {

    hideElement(workEditionModal);
    document.querySelector("body").style.overflowY = "scroll";

}

// cb
function createDeleteWorkCallback(thumb, workId) {
    return () => {
        deleteWork(workId).then(() => {
            gallery.querySelector(`.work-card[data-work-id="${workId}"]`).remove();
            thumb.remove();
        });
    }
}

function openFileSelector(e) {

    e.preventDefault();
    fileInput.click();

};
