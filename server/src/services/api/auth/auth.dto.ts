import User from "../../../db/entities/user"

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
    category: CategoryDTO
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

interface CategoryDTO {
    name: string
    subcategories?: CategoryDTO[]
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

    category: CategoryDTO

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
        this.category = user[type].category
    }
}

export {
    SignInRequest,
    SignInConfirmRequest,
    ProfileRequest,
    UserDTO,
    CategoryDTO,
    Profile,
    AuthUser
}
