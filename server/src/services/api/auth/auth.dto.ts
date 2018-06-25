import User from "../../../db/entities/user"
import Category from "../../../db/entities/category"

interface SignInRequest {
    phoneNumber: string
}

interface SignInConfirmRequest {
    code: string
    phoneNumber: string
}

interface ProfileRequest {
    phoneNumber: string
    firstName: string
    lastName: string
    birthDate: Date
    gender: string
    email: string
    age: number
    category: Category
}

interface Profile {
    status: string,
    token: string,
    info: UserDTO
}

interface AuthUser {
    id: number
    phoneNumber: string
    type: string
}

class UserDTO  {

    id: number

    type: string

    phoneNumber: string

    firstName: string

    lastName: string

    age: number

    email: string

    birthDate: Date

    gender: string

    category: Category

    constructor(user: User, type: string) {
        this.id = user.id
        this.type = type
        this.phoneNumber = user.phoneNumber.value
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.age = user.age
        this.email = user.email
        this.birthDate = user.birthDate
        this.gender = (user.gender) ? user.gender.type : null
        // this.category = user[type].category
    }
}

export {
    SignInRequest,
    SignInConfirmRequest,
    ProfileRequest,
    UserDTO,
    Profile,
    AuthUser
}
