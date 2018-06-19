
import { Service } from "typedi"
import { Repository, EntityRepository } from "typeorm"
import { InjectRepository } from "typeorm-typedi-extensions"

import User from "../../../db/entities/user"
import PhoneNumber from "../../../db/entities/phone-number";

@Service()
@EntityRepository(User)
export default class UserRepository extends Repository<User> {

    public async findUserByPhoneNumberAndRole(phoneNumber: PhoneNumber, userType: string): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", `${userType}`]}))
            .find((data) => data.phoneNumber.id === phoneNumber.id)
    }

    public async findUserByRoleAndId(userId: number, userType: string): Promise<User> {
        return (await this.find({ relations: ["phoneNumber", `${userType}`]}))
            .find((data) => data.id === userId)
    }

}
