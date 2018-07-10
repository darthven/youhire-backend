import { JsonController, HttpCode, Get } from "routing-controllers"
import { Inject } from "typedi"

import EarnerService from "./earner.service"
import Earner from "../../../db/entities/earner"

@JsonController("/earner")
export class EarnerController {

    @Inject()
    private service: EarnerService

    /**
     * TODO remove before release
     */
    @HttpCode(200)
    @Get()
    public async getAllEarners(): Promise<Earner[]> {
        return await this.service.findAllEarners()
    }

}
