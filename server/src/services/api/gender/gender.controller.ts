import { JsonController, HttpCode, Get } from "routing-controllers"
import { Inject } from "typedi"

import GenderService from "./gender.service"
import Gender from "../../../db/entities/gender"

@JsonController("/gender")
export class GenderController {

    @Inject()
    private service: GenderService

    /**
     * TODO remove before release
     */
    @HttpCode(200)
    @Get()
    public async getAllGenders(): Promise<Gender[]> {
        return await this.service.findAllGenders()
    }

}
