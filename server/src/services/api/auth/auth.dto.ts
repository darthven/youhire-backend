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

class CategoryDTO {
    name: string
    selected: boolean
    certificate: string
    subcategories?: CategoryDTO[]

    constructor(category?: Category) {
        if (category) {
            this.name = category.name
            this.selected = category.selected
            this.certificate = category.certificate
            if (category.subcategories) {
                this.subcategories = category.subcategories.map((subCat) => new CategoryDTO(subCat))
            }
        }
    }
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

    categories: CategoryDTO[]

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
        if (user[type].categories) {
            this.categories = user[type].categories.map((cat) => new CategoryDTO(cat))
        }
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
