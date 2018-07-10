import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import GenderRepository from "./gender.repository"
import Gender from "../../../db/entities/gender"

@Service()
export default class GenderService {

    @InjectRepository()
    private repository: GenderRepository

    /**
     * TODO remove before release
     */
    public async findAllGenders(): Promise<Gender[]> {
        return await this.repository.find()
    }
}
