import "reflect-metadata"
import { createConnection, Connection, useContainer as ormUseContainer, ConnectionOptions } from "typeorm"
import { createKoaServer, useContainer as routingUseContainer, Action } from "routing-controllers"
import Container from "typedi"
import { Server } from "http"

import logger from "./config/winston.user"
import AuthUtil from "./utils/auth.util"

const runServer = (controllers: any[], environment: any): Server => {
  routingUseContainer(Container)
  return createKoaServer({
    controllers,
    authorizationChecker: async (action: Action, roles: string[]) => {
      const token = action.request.headers.authorization.slice(7)
      logger.info("TOKEN", token)
      const user = AuthUtil.decodeToken(token)
      logger.info("User", user)
      if (user) {
        return true
      }
      return false
    },
    currentUserChecker: async (action: Action) => {
      const token = action.request.headers.authorization.slice(7)
      logger.info("TOKEN", token)
      return AuthUtil.decodeToken(token)
    }
  }).listen(environment.PORT, (): void => {
    logger.info(`HTTP Server listening on port: ${environment.PORT}`)
    logger.info(`Environment: ${environment.NODE_ENV}`)
  })
}

const connectToDatabase = (databaseConfig: ConnectionOptions): Promise<Connection> => {
  ormUseContainer(Container)
  return createConnection(databaseConfig)
}

export default { connectToDatabase, runServer }
