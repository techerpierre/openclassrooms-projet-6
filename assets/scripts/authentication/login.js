import { Api } from "../api/api.js"
import { CUSTOM_ERRORS_CODES, CustomError } from "../errors/custom_errors.js"
import { parseJwt } from "../helpers/jwt.js"
import { Cookies } from "./cookies.js"

export class Login {
    constructor(id) {
        this.api = new Api()        

        this.getForm(id)
        this.onSubmit(this.submitCallback.bind(this))
    }

    getForm(id) {
        const form = document.getElementById(id)
        if (!form || !(form instanceof HTMLFormElement))
            throw new Error("Error in login.js: the specified form in the login class must extends HTMLFormElement")

        this.form = form
    }

    onSubmit(cb) {
        this.form.addEventListener("submit", cb)
    }

    submitCallback(e) {
        e.preventDefault()

        const errorPopup = document.getElementById("errorPopup");

        const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const passwordRegexp = /^(?=.*\d).{6,}$/

        const emailField = e.target["email"]
        const passwordField = e.target["password"]

        const email = emailField.value
        const password = passwordField.value

        let isFieldsCorrects = true;

        const setBadField = (field) => {
            const defaultFieldFieldStyle = field.style.outline

            field.style.outline = "solid 2px red"
            
            setTimeout(() => {
                field.style.outline = defaultFieldFieldStyle
            }, 5000) 
        }

        if (!emailRegexp.test(email)) {
            isFieldsCorrects = false
            setBadField(emailField)           
        }

        if (!passwordRegexp.test(password)) {
            isFieldsCorrects = false
            setBadField(passwordField)         
        }

        if (!isFieldsCorrects) {
            errorPopup.addError(new CustomError(CUSTOM_ERRORS_CODES.INCORECT_LOGIN_CREDENTIALS_FORMAT).message)
            return
        }

        this.api.Login({ email, password }).then(result => {
            this.storeAccessToken(result.token)
            window.location.assign("../index.html")
        }).catch(e => {
            if (e instanceof CustomError)
                errorPopup.addError(e.message)
        })
    }

    storeAccessToken(token) {
        const { payloads } = parseJwt(token)
        Cookies.setCookie("token", token, { exp: payloads.exp })
    }

    static logout() {
        Cookies.removeCookie("token")
        window.location.assign("./pages/login.html")
    }
}