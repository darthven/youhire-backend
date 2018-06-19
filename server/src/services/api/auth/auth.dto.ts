import User from "../../../db/entities/user"
import Earner from "../../../db/entities/earner"
import Spender from "../../../db/entities/spender"
import PhoneNumber from "../../../db/entities/phone-number"
import Gender from "../../../db/entities/gender"
import Category from "../../../db/entities/category";

interface SignInRequest {
    phoneNumber: string
}

interface SignInConfirmRequest {
    code: string
    phoneNumber: string
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
        this.gender = (user.gender) ? user.gender.genderType : null
        this.category = user[type].category
    }
}

interface EarnerDTO extends UserDTO {
    category: Category
}

interface SpenderDTO extends UserDTO {
    creditData: any
}

interface Profile {
    status: string,
    token: string,
    profile: EarnerDTO | SpenderDTO
}

export {
    SignInRequest,
    SignInConfirmRequest,
    UserDTO,
    EarnerDTO,
    SpenderDTO,
    Profile
}
