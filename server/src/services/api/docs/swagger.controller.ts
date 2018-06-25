import { Get, JsonController } from "routing-controllers"
import swaggerJSDoc = require("swagger-jsdoc")

import docs from "./docs"
import swaggerConfig from "../../../config/swagger.config"

@JsonController()
export class SwaggerController {

    private readonly swaggerSpec = swaggerJSDoc(swaggerConfig)

    @Get("/swagger")
    public async getDocs() {
       return this.swaggerSpec
    }
}
