import { getStoredWorks, setStoredWorks } from "./works.js";
import { setStoredCategories } from "./categories.js";
import { getWorks, getCategories } from "./apiCalls.js";
import { createWorkCard, createDeleteWorkThumb, createDeleteWorkCallback, addErrorPopup } from "./helpers.js";

const gallery = document.getElementById("gallery");
const filters = document.querySelectorAll("#filters > button");
const deleteWorkList = document.getElementById("deleteWorkList");
const popupContainer = document.getElementById("popupContainer");

getWorks().then(data => {

    setStoredWorks(data);

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

        deleteWorkCard.querySelector("button").addEventListener("click", createDeleteWorkCallback(deleteWorkCard, workId, popupContainer));

    });

}).catch(() => {
    addErrorPopup(popupContainer, "Impossible de lister les travaux.")
    setStoredWorks(null);
});

getCategories().then(data => {
    setStoredCategories(data);
}).catch(() => {
   addErrorPopup(popupContainer, "Impossible de lister les catégoties.")
   setStoredCategories(null);
});

filters.forEach(filter => {

    filter.addEventListener("click", () => {

        const categoryId = filter.getAttribute("data-category-id");

        const filteredWorks = getStoredWorks().filter(work => Number(categoryId) === 0 || work.category.id === Number(categoryId));

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
