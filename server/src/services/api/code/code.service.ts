import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"
import CodeRepository from "./code.repository";

@Service()
export default class CodeService {

    @InjectRepository()
    private repository: CodeRepository

    public async getAllCodesWithPhoneNumber() {
        return this.repository.getCodesByPhoneNumber()
    }

}
