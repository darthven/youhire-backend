import { Repository, EntityRepository } from "typeorm"
import { Service } from "typedi"

import Earner from "../../../db/entities/earner"

@Service()
@EntityRepository(Earner)
export default class EarnerRepository extends Repository<Earner> {

}
