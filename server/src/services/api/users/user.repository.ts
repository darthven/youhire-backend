
import { Service } from "typedi"
import { Repository, EntityRepository } from "typeorm"

import User from "../../../db/entities/user"
import PhoneNumber from "../../../db/entities/phone-number"
import { UserType } from "../../../common"

@Service()
@EntityRepository(User)
export default class UserRepository extends Repository<User> {

    public async findAllUsersByPhoneNumberAndGender(): Promise<User[]> {
        return await this.find({ relations: ["phoneNumber", "numbersHistory", "gender"]})
    }

    public async findUserByIdAndPhoneNumberAndType(userId: number, userType: UserType): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", "numbersHistory", userType]}))
            .find((data) => data.id === userId)
    }

    public async findUserByPhoneNumber(phoneNumber: PhoneNumber): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", "numbersHistory"]}))
            .find((data) => data.phoneNumber.id === phoneNumber.id)
    }

    public async findUserByPhoneNumberAndGender(phoneNumber: PhoneNumber): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", "numbersHistory", "gender"]}))
            .find((data) => data.phoneNumber.id === phoneNumber.id)
    }

    public async findUserAsEarnerById(userId: number): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", "numbersHistory", UserType.EARNER]}))
            .find((data) => data.id === userId)
    }

    public async findUserAsEarnerByPhoneNumber(phoneNumber: PhoneNumber): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", "numbersHistory", UserType.EARNER]}))
            .find((data) => data.phoneNumber.id === phoneNumber.id)
    }

    public async findUserAsSpenderById(userId: number): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", UserType.SPENDER]}))
            .find((data) => data.id === userId)
    }

    public async findUserAsSpenderByPhoneNumber(phoneNumber: PhoneNumber): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", UserType.SPENDER]}))
            .find((data) => data.phoneNumber.id === phoneNumber.id)
    }
}
