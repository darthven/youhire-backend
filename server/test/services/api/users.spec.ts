// import * as chai from "chai"
// import chaiHttp = require("chai-http")

// import runServer from "../../../src/index"

// const should = chai.should()
// const BASE_URL = "/users"

// chai.use(chaiHttp)

// describe("routes : auth", () => {
//   let token
//   before(async function () {
//     await migrateDB()
//     token = await getToken()
//   })
//   describe(`POST ${BASE_URL}/login`, () => {
//     it("should throw error if user not exist", (done) => {
//       chai.request(server)
//         .post(`${BASE_URL}/login`)
//         .send({
//           username: "jeremy",
//           password: "johnson"
//         })
//         .end((err, res) => {
//           should.exist(err)
//           res.status.should.equal(401)
//           res.type.should.equal("application/json")
//           res.body.status.should.eql("error")
//           done()
//         })
//     })
//   })
//   describe(`GET ${BASE_URL}`, () => {
//     it("should get info about valid user", (done) => {
//       chai.request(server)
//         .get(BASE_URL)
//         .set("Authorization", "Bearer " + token)
//         .end((err, res) => {
//           should.not.exist(err)
//           res.status.should.equal(200)
//           res.type.should.equal("application/json")
//           res.body.should.include.keys("status", "user")
//           res.body.status.should.eql("success")
//           res.body.user.should.include.keys("id", "username")
//           res.body.user.username.should.eql("pixioAdmin1")
//           done()
//         })
//     })
//     it("shouldn't get info about invalid user", (done) => {
//       chai.request(server)
//         .get(BASE_URL)
//         .set("Authorization", "Bearer " + token + "*")
//         .end((err, res) => {
//           should.exist(err)
//           res.status.should.equal(401)
//           res.type.should.equal("application/json")
//           res.body.should.include.keys("status", "message")
//           res.body.status.should.eql("error")
//           res.body.message.should.eql("unauthorized")
//           done()
//         })
//     })
//   })
// })
