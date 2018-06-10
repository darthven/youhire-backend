
import { Service } from "typedi"
import { Repository, EntityRepository } from "typeorm"
import { InjectRepository } from "typeorm-typedi-extensions"

import User from "../../../db/entities/user"

@Service()
@EntityRepository(User)
export default class UserRepository extends Repository<User> {

    public async findByPhoneNumber(phoneNumber: string): Promise<User> {
        return await this.findOne({ phoneNumber })
    }

    public async findByFirstName(firstName: string): Promise<User> {
        return await this.findOne({ firstName })
    }

    public async findByLastName(lastName: string): Promise<User> {
        return await this.findOne({ lastName })
    }

    public async findByEmail(email: string): Promise<User> {
        return this.findOne({ email })
    }
}
