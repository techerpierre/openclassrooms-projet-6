const API_DOMAIN = "http://localhost:5678/api"

export async function getWorks() {

    const response = await fetch(API_DOMAIN + "/works");

    if (response.status !== 200)
        throw new Error("Fieled to fetch works.");

    return response.json();

}

export async function deleteWork(id) {

    const response = await fetch(API_DOMAIN + "/works/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
        },
    });

    if (response.status !== 204)
        throw new Error("Failed to delete work");

}

export async function createWork(data) {

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

export async function getCategories() {

    const response = await fetch(API_DOMAIN + "/categories");

    if (response.status !== 200)
        throw new Error("Unable to get categories.");

    return response.json();

}