import { getStoredElement, setStoredElement } from "./helpers.js"

export const getStoredWorks = () => {
    return getStoredElement("works");
}

export const setStoredWorks = (data) => {
    setStoredElement("works", data);
}