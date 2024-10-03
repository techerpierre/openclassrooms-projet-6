export class Cookies {

    static getCookie(key) {
        const cookies = document.cookie.split(";")
        
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim()

            if (cookie.indexOf(key + "=") === 0) {
                return cookie.substring(key.length + 1)
            }
        }

        return null
    }

    static setCookie(key, value, opts) {
        const expDate = new Date()

        if (opts.exp) {
            expDate.setTime(expDate.getTime() + opts.exp)
        }

        const newCookie = `${key}=${value}${opts.maxAge? ";max-age=" + opts.maxAge : ""}${opts.exp? `;expires=${expDate.toUTCString()}` : ""};path=${opts.path ?? "/"}`

        document.cookie = newCookie;
    }

    static removeCookie(key, path = "/") {
        document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`
    }

}