import "reflect-metadata"
import { createConnection, Connection, useContainer as ormUseContainer, ConnectionOptions } from "typeorm"
import { createKoaServer, useContainer as routingUseContainer, Action, UnauthorizedError } from "routing-controllers"
import Container from "typedi"
import { Server } from "http"
import koaSwagger = require("koa2-swagger-ui")

import logger from "./config/winston.user"
import AuthUtil from "./utils/auth.util"

const provideDocumentation = (environment: any): void => {
  return koaSwagger({
    routePrefix: "/docs",
    swaggerOptions: {
      url: `http://localhost:${environment.PORT}/swagger`
    }
  })
}

const runServer = (controllers: any[], environment: any): Server => {
  routingUseContainer(Container)
  const koaServer = createKoaServer({
    cors: true,
    controllers,
    authorizationChecker: async (action: Action, roles: string[]) => {
      const authorization = action.request.headers.authorization
      if (authorization) {
        const token = authorization.slice(7)
        const user = AuthUtil.decodeToken(token)
        if (user) {
          return true
        }
      } else {
        throw new UnauthorizedError("User is unauthorized")
      }
      return false
    },
    currentUserChecker: async (action: Action) => {
      const token = action.request.headers.authorization.slice(7)
      return AuthUtil.decodeToken(token)
    }
  })
  koaServer.use(
    provideDocumentation(environment)
  )
  return koaServer.listen(environment.PORT, (): void => {
    logger.info(`HTTP Server listening on port: ${environment.PORT}`)
    logger.info(`Environment: ${environment.NODE_ENV}`)
  })
}

const connectToDatabase = (databaseConfig: ConnectionOptions): Promise<Connection> => {
  ormUseContainer(Container)
  return createConnection(databaseConfig)
}

export default { connectToDatabase, runServer }
