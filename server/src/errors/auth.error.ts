import { HttpError } from "routing-controllers"

class ValidationError extends HttpError {

    payload: string

    constructor(payload?: string) {
        super(400, "Some parameters are invalid or missed")
        this.name = "ValidationError"
        this.payload = payload
    }

}

class PhoneNumberNotFoundError extends HttpError {

    constructor() {
        super(402, "Phone number is not registered")
        this.name = "PhoneNumberNotFoundError"
    }

}

class InvalidVerificationCodeError extends HttpError {

    constructor() {
        super(403, "Invalid verification code")
        this.name = "InvalidVerificationCodeError"
    }

}

class RoleNotFoundError extends HttpError {

    constructor(type: string) {
        super(404, `Role "${type}" is not supported`)
        this.name = "RoleNotFoundError"
    }

}

export {
    ValidationError,
    PhoneNumberNotFoundError,
    InvalidVerificationCodeError,
    RoleNotFoundError
}
