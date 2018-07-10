
import { ConnectionOptions } from "typeorm"

import env from "./config/env.config"
import dbConfig from "./config/ormconfig"
import app from "./index"
import { seed } from "./db/seeds/index"
import { AuthController } from "./services/api/auth/auth.controller"
import { UserController } from "./services/api/users/user.controller"
import JobController from "./services/api/job/job.controller"
import { SwaggerController } from "./services/api/docs/swagger.controller"
import { CodeController } from "./services/api/code/code.controller"
import { PhoneNumberController } from "./services/api/phone-number/phone-number.controller"
import { CategoryController } from "./services/api/category/category.controller"
import { StripeController } from "./services/api/stripe/stripe.controller"
import { EarnerController } from "./services/api/earner/earner.controller"
import { SpenderController } from "./services/api/spender/spender.controller"
import { GenderController } from "./services/api/gender/gender.controller"

const runApplication = async (): Promise<void> => {
    const appControllers = [
      AuthController,
      UserController,
      JobController,
      CodeController,
      PhoneNumberController,
      CategoryController,
      StripeController,
      SwaggerController,
      EarnerController,
      SpenderController,
      GenderController
    ]
    await app.connectToDatabase(dbConfig as ConnectionOptions)
    seed()
    app.runServer(appControllers, env)
}

runApplication()
