import { Service } from "typedi"
import { EntityRepository, Repository } from "typeorm"
import { isNullOrUndefined } from "util"

import Code from "../../../db/entities/code"

@Service()
@EntityRepository(Code)
export default class CodeRepository extends Repository<Code> {

    public async codeExists(value: string): Promise<boolean> {
        return !isNullOrUndefined(await this.findOne({ value }))
    }

}
