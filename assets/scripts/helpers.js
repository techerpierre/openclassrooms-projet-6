import { setStoredWorks } from "./works.js";
import { deleteWork } from "./apiCalls.js";

export function showElement(element) {
    element.classList.remove("undisplay");
}

export function hideElement(element) {
    element.classList.add("undisplay");
}

export function handleDisplay(condition, elements) {

    if (Array.isArray(elements)) {
        elements.forEach(element => {
            if (condition)
                showElement(element)
            else
            hideElement(element);
        });
    }

}

export function displayOnEditMode(...elements) {

    const isEditMode = Boolean(localStorage.getItem("token"));
    handleDisplay(isEditMode, elements);

}

export function undisplayOnEditMode(...elements) {

    const isEditMode = Boolean(localStorage.getItem("token"));
    handleDisplay(!isEditMode, elements);

}

export function getStoredElement(key) {
    const elements = sessionStorage.getItem(key);
    if (elements)
        return JSON.parse(elements).data;
    else return null;
}

export function setStoredElement(key, data) {
    let newElement = null;
    if (typeof data === "function") {
        const prevElement = getStoredElement(key);
        const newData = data(prevElement);
        newElement = { type: typeof newData, data: newData };
    } else {
        newElement = { type: typeof data, data: data };
    }
    sessionStorage.setItem(key, JSON.stringify(newElement))
}

export function createElement(tagname, attributes = {}, children = []) {

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

export function createWorkCard(data) {
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

export function createDeleteWorkThumb(data) {
    return createElement("div", { class: "delete-work-thumb", "data-work-id": data.id }, [
        createElement("img", { src: data.imageUrl, alt: data.title }),
        createElement("button", {}, [
            createElement("img", { src: "../../assets/icons/bin.png" }),
        ]),
    ]);
}

export function createFileInputPreview(src) {
    return createElement("img", { src, alt: "uploaded image preview", class: "file-preview-image" });
}

export function createEmptyFileInputPreview() {
    return [
        createElement("img", { src: "../../assets/icons/placeholder.png", alt: "image placeholder" }),
        createElement("button", { id: "addFileButton" }, "+ Ajouter photo"),
        createElement("small", {}, "jpg, png : 4mo max"),
    ];
}

export function createPopup(message, theme) {
    return createElement("div", { class: `popup ${theme ?? "popup-blue"}` }, [
        createElement("span", {}, message),
    ]);
}

export function createDeleteWorkCallback(thumb, workId, popupContainer) {
    return () => {
        deleteWork(workId).then(() => {
            gallery.querySelector(`.work-card[data-work-id="${workId}"]`).remove();
            setStoredWorks((prevWorks) => prevWorks.filter(work => work.id.toString() !== workId))
            thumb.remove();
            addSuccessPopup(popupContainer, "Un travail à été supprimé.");
        }).catch(() => {
            addErrorPopup(popupContainer, "Impossible de supprimer ce travail.");
        });
    }
}

export function addPopup(parent, message, theme) {
    const popups = document.querySelectorAll(`#${parent.id} > .popup`);
    if (popups.length > 4) {
        popups[0].remove();
    }
    const popup = createPopup(message, theme);
    parent.appendChild(popup);
    setTimeout(() => {
        popup.remove();
    }, 4000);
}

export function addErrorPopup(parent, message) {
    addPopup(parent, message, "popup-red");
}

export function addSuccessPopup(parent, message) {
    addPopup(parent, message, "popup-green");
}