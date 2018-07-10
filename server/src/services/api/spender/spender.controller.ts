import { JsonController, HttpCode, Get } from "routing-controllers"
import { Inject } from "typedi"

import SpenderService from "./spender.service"
import Spender from "../../../db/entities/spender"

@JsonController("/spender")
export class SpenderController {

    @Inject()
    private service: SpenderService

    /**
     * TODO remove before release
     */
    @HttpCode(200)
    @Get()
    public async getAllEarners(): Promise<Spender[]> {
        return await this.service.findAllSpenders()
    }

}
