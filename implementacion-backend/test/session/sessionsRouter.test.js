import { expect } from "chai"
import supertest from "supertest"

const url = supertest("http://localhost:8080")

describe("User session router test", () => {

    it("Test 1 - [POST] /api/sessions/register | Resgister user", async function () {
        const mockUser = {
            first_name: "Pepe",
            last_name: "Sanchez",
            email: "pepesanchez2@email.com",
            password: "pepepass",
        }
        const testUser = await url.post("/api/sessions/register").send(mockUser)
        expect(testUser.statusCode).to.be.eql(200)
        expect(testUser.header["set-cookie"]).is.not.exist
    })

    it("Test 2 - [POST] /api/sessions/login | Login user", async function () {
        const mockUser = {
            email: "pepesanchez2@email.com",
            password: "pepepass"
        }
        const testUser = await url.post("/api/sessions/login").send(mockUser)
        expect(testUser.statusCode).to.be.eql(200)
        expect(testUser.header["set-cookie"]).to.be.an("array").that.is.not.empty
        console.log(testUser.header)

    })

    it("Test 3 - [POST] /api/sessions/logout | Logout user", async function () {
        const testUser = await url.post("/api/sessions/logout")
        expect(testUser.statusCode).to.be.eql(200)
        expect(testUser.header["set-cookie"]).is.not.exist
        console.log(testUser.header)

    })

    it("Test 4 - [POST] /api/sessions/restartPassword | Restart user password", async function () {
        const mockUser = {
            email: "pepesanchez2@email.com",
            password: "pepepassNEW"
        }
        const testUser = await url.post("/api/sessions/restartPassword").send(mockUser)
        expect(testUser.statusCode).to.be.eql(200)
        expect(testUser.header["set-cookie"]).is.not.exist
        expect(testUser.body.message).to.deep.equal("Password restarted")

    })

})