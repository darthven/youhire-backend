import "reflect-metadata"
import * as Koa from "koa"
import { createConnection, Connection, QueryFailedError,
  useContainer as ormUseContainer, ConnectionOptions } from "typeorm"
import { createKoaServer, useContainer as routingUseContainer } from "routing-controllers"
import Container from "typedi"
import { Server } from "http"

import env from "./config/env.config"
import dbConfig from "./config/ormconfig"
import logger from "./config/winston.user"
import { AuthController } from "./services/api/auth/auth.controller"
import { UserController } from "./services/api/users/user.controller"

routingUseContainer(Container)
ormUseContainer(Container)

const appControllers = [
  AuthController,
  UserController
]

const runServer = (controllers: any[]): Server => {
  return createKoaServer({
    controllers
  }).listen(env.PORT, (): void => {
    logger.info(`HTTP Server listening on port: ${env.PORT}`)
    logger.info(`Environment: ${env.NODE_ENV}`)
  })
}

const connectToDatabase = (databaseConfig: ConnectionOptions): Promise<Connection> => {
  return createConnection(databaseConfig)
}

const runApplication = async () => {
  await connectToDatabase(dbConfig as ConnectionOptions)
  runServer(appControllers)
}

runApplication()

export { connectToDatabase, runServer }
