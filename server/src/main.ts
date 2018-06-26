
import { ConnectionOptions } from "typeorm"

import env from "./config/env.config"
import dbConfig from "./config/ormconfig"
import { AuthController } from "./services/api/auth/auth.controller"
import { UserController } from "./services/api/users/user.controller"
import JobController from "./services/api/job/job.controller"
import { SwaggerController } from "./services/api/docs/swagger.controller"
import { CodeController } from "./services/api/code/code.controller"
import { PhoneNumberController } from "./services/api/phone-number/phone-number.controller"
import app from "./index"

const runApplication = async (): Promise<void> => {
    const appControllers = [
      AuthController,
      UserController,
      JobController,
      CodeController,
      PhoneNumberController,
      SwaggerController
    ]
    await app.connectToDatabase(dbConfig as ConnectionOptions)
    app.runServer(appControllers, env)
}

runApplication()
