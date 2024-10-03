import apiConfig from "../../api.config.js"
import { CUSTOM_ERRORS_CODES, CustomError } from "../errors/custom_errors.js"

const { baseUrl, routes } = apiConfig

export class Api {
    constructor() {
        if (Api.instance)
            return Api.instance
        Api.instance = this
        return this
    }
    async Login(credentials) {

        if (!credentials.email || !credentials.password)
            throw new CustomError(CUSTOM_ERRORS_CODES.LOGIN_FAILED)

        const response = await fetch(baseUrl + routes.users.login.path, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(credentials)
        })

        if (response.status != 200)
            throw new CustomError(CUSTOM_ERRORS_CODES.LOGIN_FAILED)

        return response.json()
    }

    async GetCategories() {
        const response = await fetch(baseUrl + routes.categories.path)

        if (response.status != 200)
            throw new CustomError(CUSTOM_ERRORS_CODES.CATEGORIES_RECOVERY_FAILED)

        return response.json()
    }

    async GetWorks() {
        const response = await fetch(baseUrl + routes.works.path)

        if (response.status != 200)
            throw new CustomError(CUSTOM_ERRORS_CODES.WORKS_RECOVERY_FAILED)

        return response.json()
    }

    async CreateWork(data, token) {
        const response = await fetch(baseUrl + routes.works.path, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
            },
            body: data
        })

        if (response.status != 200)
            throw new CustomError(CUSTOM_ERRORS_CODES.WORK_CREATION_FAILED)

        return response.json()
    }

    async DeleteWork(id, token) {
        const response = await fetch(baseUrl + routes.works.path + `/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })

        if (response.status != 204)
            throw new CustomError(CUSTOM_ERRORS_CODES.WORK_DELETION_FAILED)

        return
    }
}