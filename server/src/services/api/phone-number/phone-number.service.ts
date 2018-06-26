import { Service } from "typedi"
import { InjectRepository } from "typeorm-typedi-extensions"

import PhoneNumberRepository from "./phone-number.repository"
import PhoneNumber from "../../../db/entities/phone-number";

@Service()
export default class PhoneNumberService {

    @InjectRepository()
    private repository: PhoneNumberRepository

    public async getAllPhoneNumbers(): Promise<PhoneNumber[]> {
        return await this.repository.getPhoneNumbersByUserAndCodes()
    }

}
