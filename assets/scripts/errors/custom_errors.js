import messages from "../../errors.config.js"

export const CUSTOM_ERRORS_CODES = {
    LOGIN_FAILED: 0,
    CATEGORIES_RECOVERY_FAILED: 1,
    WORKS_RECOVERY_FAILED: 2,
    WORK_CREATION_FAILED: 3,
    WORK_DELETION_FAILED: 4,
    INCORECT_LOGIN_CREDENTIALS_FORMAT: 5,
}

export class CustomError extends Error {
    constructor(code) {
        super(CustomError.getMessage(code))
        this.code = code
    }

    static getMessage(code) {
        const language = localStorage.getItem("language")
        return messages[language || messages.defaultLanguage][code]
    }
}
