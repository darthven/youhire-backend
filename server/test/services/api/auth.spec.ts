import "reflect-metadata"
import "mocha"
import * as request from "supertest"
import { useContainer as ormUseContainer, ConnectionOptions, Connection } from "typeorm"
import { useContainer as routingUseContainer } from "routing-controllers"
import Container from "typedi"
import { Server } from "http"

import dbConfig from "../../../src/config/ormconfig"
import { connectToDatabase, runServer } from "../../../src/index"
import { AuthController } from "../../../src/services/api/auth/auth.controller"

const SEND_URL: string = "/api/user/send"
const CONFIRM_URL: string = "api/user/auth/earner"

describe("Authentication", () => {
    routingUseContainer(Container)
    ormUseContainer(Container)
    const testControllers = [
        AuthController
    ]
    let dbConnection: Connection
    let server: Server
    beforeEach(async () => {
        dbConnection = await connectToDatabase(dbConfig as ConnectionOptions)
        server = runServer(testControllers)
    })
    it("Sign in request", async (done) => {
        request(server)
            .post(SEND_URL)
            .send({
                phoneNumber: "+380662405263"
            })
            .expect(201)
            .expect("Content-Type", "application/json")
            .expect((res) => res.message === "SMS was sent successfully")
            .end((err, res) => {
                if (err) {
                    throw err
                }
                done()
            })
    })
    afterEach(async () => {
        await dbConnection.close()
        server.close()
    })
    // const resultDTO = {
    //     status: "Success",
    //     token: "asdasd",
    //     profile: {
    //         id: 1,
    //         type: "earner",
    //         phoneNumber: "+380662405263",
    //         numbersHistory: ["+380662405263"],
    //         gender: null,
    //         firstName: null,
    //         lastName: null,
    //         email: null,
    //         birthDate: null,
    //         age: null
    //     }
    // }
})
