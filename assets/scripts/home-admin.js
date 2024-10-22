import { showElement, hideElement, displayOnEditMode, undisplayOnEditMode, createDeleteWorkThumb, createEmptyFileInputPreview, createFileInputPreview, createWorkCard, createDeleteWorkCallback } from "./helpers.js";
import { createWork } from "./apiCalls.js";
import { getStoredCategories } from "./categories.js";
import { setStoredWorks } from "./works.js";

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
const fileInput = document.getElementById("fileInput");
const filePreview = document.getElementById("filePreview");
const createWorkForm = document.getElementById("createWorkForm");
const filterList = document.getElementById("filters")

const isEditMode = Boolean(localStorage.getItem("token"));

hideElement(workEditionModal);
hideElement(createWorkView);

displayOnEditMode(
    editionBanner,
    openWorkEditor,
);

undisplayOnEditMode(
    filterList,
);

handleLoginLinkRedirection();

function handleLoginLinkRedirection() {
    if (isEditMode) {
        loginLink.innerText = "Logout";
        loginLink.addEventListener("click", loginLinkClickCallback);
    } else {
        loginLink.innerText = "Login";
        loginLink.removeEventListener("click", loginLinkClickCallback);
    }
}

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

    const categoryId = getStoredCategories().find(val => val.name === category)?.id;

    if (!categoryId)
        throw new Error("This category is not exist");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", categoryId);
    
    createWork(formData).then(data => {

        e.target["title"].value = "";
        e.target["category"].value = "";
        setStoredWorks((prevWorks) => [...prevWorks, data])
        gallery.appendChild(createWorkCard(data));
        const workThumb = createDeleteWorkThumb(data);
        workThumb.querySelector("button").addEventListener("click", createDeleteWorkCallback(workThumb, data.id));
        deleteWorkList.appendChild(workThumb);
        closeModal();

    });

});

function loginLinkClickCallback(e) {

    e.preventDefault();
    localStorage.removeItem("token");
    window.location.replace("./pages/login.html");

}

function closeModal() {

    hideElement(workEditionModal);
    document.querySelector("body").style.overflowY = "scroll";

}

function openFileSelector(e) {

    e.preventDefault();
    fileInput.click();

};