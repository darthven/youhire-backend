import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import EarnerRepository from "./earner.repository"
import Earner from "../../../db/entities/earner"

@Service()
export default class EarnerService {

    @InjectRepository()
    private repository: EarnerRepository

    public async findAllEarners(): Promise<Earner[]> {
        return await this.repository.find()
    }
}
