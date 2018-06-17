import { Repository, EntityRepository } from "typeorm"
import { Service } from "typedi"

import Spender from "../../../db/entities/spender"

@Service()
@EntityRepository(Spender)
export default class SpenderRepository extends Repository<Spender> {

}
