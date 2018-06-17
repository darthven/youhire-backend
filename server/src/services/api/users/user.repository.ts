
import { Service } from "typedi"
import { Repository, EntityRepository } from "typeorm"
import { InjectRepository } from "typeorm-typedi-extensions"

import User from "../../../db/entities/user"

@Service()
@EntityRepository(User)
export default class UserRepository extends Repository<User> {

}
