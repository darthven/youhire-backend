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

interface UserDTO  {

    id: number

    type: string

    phoneNumber: string

    numbersHistory: string[]

    firstName: string

    lastName: string

    age: number

    email: string

    birthDate: Date

    gender: string
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
