import "reflect-metadata"
import * as Koa from "koa"
import * as bodyParser from "koa-bodyparser"
import * as Router from "koa-router"
import { createConnection, Connection, QueryFailedError } from "typeorm"
import { Server } from "net"

import { UserRoutes } from "./services/api/users/user.routes"
import env from "./config/env.config"
import logger from "./config/winston.user"

const runServer = (): Server => {
  const app: Koa = new Koa()
  const router = new Router()
  UserRoutes.forEach((route) => router[route.method](route.path, route.action))
  app.use(bodyParser())
  app.use(router.routes())
  app.use(router.allowedMethods())
  return app.listen(env.PORT, (): void => {
    logger.info(`HTTP Server listening on port: ${env.PORT}`)
    logger.info(`Environment: ${env.NODE_ENV}`)
  })
}

const runApplication = async (): Promise<Server | QueryFailedError> => {
  return createConnection().then(async (connection: Connection) => runServer())
    .catch((err: QueryFailedError) => {
      logger.error(`TypeORM error ${err}`)
      return err
    }
  )
}

runApplication()

export default runServer
