import "reflect-metadata"
import * as Koa from "koa"
import * as bodyParser from "koa-bodyparser"
import * as Router from "koa-router"
import { createConnection, Connection, QueryFailedError, useContainer as ormUseContainer } from "typeorm"
import { createKoaServer, useContainer as routingUseContainer } from "routing-controllers"
import Container from "typedi"
import { Server } from "net"

import env from "./config/env.config"
import logger from "./config/winston.user"
import { UserController } from "./services/api/users/user.controller"

routingUseContainer(Container)
ormUseContainer(Container)

const app: Koa = createKoaServer({
  controllers: [UserController]
})

const runServer = (): Server => {
  return app.listen(env.PORT, (): void => {
    logger.info(`HTTP Server listening on port: ${env.PORT}`)
    logger.info(`Environment: ${env.NODE_ENV}`)
  })
}

const runApplication = async (): Promise<Server | QueryFailedError> => {
  return createConnection().then(async (connection: Connection) => await runServer())
    .catch((err: QueryFailedError) => {
      logger.error(`TypeORM error ${err}`)
      return err
    }
  )
}

runApplication()

export default runServer
