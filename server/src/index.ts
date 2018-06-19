import "reflect-metadata"
import { createConnection, Connection, useContainer as ormUseContainer, ConnectionOptions } from "typeorm"
import { createKoaServer, useContainer as routingUseContainer } from "routing-controllers"
import Container from "typedi"
import { Server } from "http"

import logger from "./config/winston.user"

const runServer = (controllers: any[], environment: any): Server => {
  routingUseContainer(Container)
  return createKoaServer({
    controllers
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
