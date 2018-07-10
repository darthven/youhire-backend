import { JsonController, HttpCode, Get } from "routing-controllers"
import { Inject } from "typedi"

import CodeService from "./code.service"
import Code from "../../../db/entities/code"

@JsonController("/codes")
export class CodeController {

    @Inject()
    private service: CodeService

    /**
     * TODO remove before release
     */
    @HttpCode(200)
    @Get()
    public async getCodes(): Promise<Code[]> {
        return await this.service.getAllCodesWithPhoneNumber()
    }

}
