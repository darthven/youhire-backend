import { Repository, EntityRepository } from "typeorm"
import { Service } from "typedi"

import Spender from "../../../db/entities/spender"

@Service()
@EntityRepository(Spender)
export default class SpenderRepository extends Repository<Spender> {

    public async findSpenderByIdAndStripeAccount(spenderId: number): Promise<Spender> {
        return (await this.find({ relations: ["stripeAccount"] })).find((spender) => spender.id === spenderId)
    }
}
