import { JsonController, HttpCode, Get } from "routing-controllers"
import { Inject } from "typedi"

import PhoneNumberService from "./phone-number.service"
import PhoneNumber from "../../../db/entities/phone-number"

@JsonController("/numbers")
export class PhoneNumberController {

    @Inject()
    private service: PhoneNumberService

    /**
     * TODO remove before release
     */
    @HttpCode(200)
    @Get()
    public async getAllPhoneNumbers(): Promise<PhoneNumber[]> {
        return await this.service.getAllPhoneNumbers()
    }

}
