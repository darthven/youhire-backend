import "reflect-metadata"
import "mocha"
import * as sinon from "sinon"
import * as request from "supertest"
import { useContainer as ormUseContainer, ConnectionOptions, Connection } from "typeorm"
import { useContainer as routingUseContainer } from "routing-controllers"
import Container from "typedi"
import { Server } from "http"

import dbConfig from "../../config/ormconfig"
import env from "../../config/env.config"
import app from "../../../src/index"
import logger from "../../../src/config/winston.user"
import SMSService from "../../../src/services/api/sms/sms.service"
import { AuthController } from "../../../src/services/api/auth/auth.controller"

const SEND_URL: string = "/api/user/send"
const CONFIRM_URL: string = "api/user/auth"
const testControllers = [
    AuthController
]

describe("Authentication", () => {

    let sendSMS: any
    let formatNumber: any
    let dbConnection: Connection
    let server: Server

    before(async () => {
        routingUseContainer(Container)
        ormUseContainer(Container)
        dbConnection = await app.connectToDatabase(dbConfig as ConnectionOptions)
        server = app.runServer(testControllers, env)
        sendSMS = sinon.stub(SMSService.prototype, "formatNumber").callsFake((item) => item)
        formatNumber = sinon.stub(SMSService.prototype, "sendSMS").callsFake(() => {
            logger.info("SMS was sent")
        })
    })
    after(async () => {
        // sendSMS.restore()
        // formatNumber.restore()
        // await dbConnection.dropDatabase()
        // await dbConnection.close()
        // server.close()
    })
    describe("Unregistered users", () => {
        it("Send message with code", (done) => {
            request(server)
                .post(SEND_URL)
                .send({
                    phoneNumber: "+380662405263"
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => res.body.message === "SMS was sent successfully")
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })
        it("Send message with code to invalid number", (done) => {
            request(server)
                .post(SEND_URL)
                .send({
                    phoneNumber: "+38066242305263"
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => res.body.message === "SMS was sent successfully")
                .end((err, res) => {
                    if (err) {
                        return done(err)
                    }
                    done()
                })
        })
        it("Confirm code and sign in/up", (done) => {
            const resultDTO = {
                status: "Success",
                token: "asdasd",
                profile: {
                    id: 1,
                    type: "earner",
                    phoneNumber: "+380662405263",
                    gender: null,
                    firstName: null,
                    lastName: null,
                    email: null,
                    birthDate: null,
                    age: null
                }
            }
            request(server)
                .post(`${CONFIRM_URL}/earner`)
                .send({
                    phoneNumber: "+380662405263",
                    code: "12345"
                })
                .expect(201)
                .expect("Content-Type", /json/)
                .expect((res) => res.body === resultDTO)
                .end((err, res) => {
                    if (err) {
                        throw err
                    }
                    done()
                })
        })
    })
})
