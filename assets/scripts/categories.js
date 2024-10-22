import { getStoredElement, setStoredElement } from "./helpers.js"

export const getStoredCategories = () => {
    return getStoredElement("categories");
}

export const setStoredCategories = (data) => {
    setStoredElement("categories", data);
}