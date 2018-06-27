import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import SpenderRepository from "./spender.repository"
import Spender from "../../../db/entities/spender"

@Service()
export default class SpenderService {

    @InjectRepository()
    private repository: SpenderRepository

    public async findAllSpenders(): Promise<Spender[]> {
        return await this.repository.find()
    }
}
