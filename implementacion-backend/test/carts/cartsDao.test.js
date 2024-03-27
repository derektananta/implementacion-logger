import { expect } from "chai"
import mongoose from "mongoose"
import config from "../../src/config/config.js"
import Carts from "../../src/dao/classes/carts.dao.js"

const { MongoTestURL } = config

const cartMock = {
    products: [
        {
            product: "12345abcedf",
            quantity: 2
        },
        {
            product: "6789ghijklm",
            quantity: 1
        }
    ]
}

let newCart;

describe("Testing Carts DAO", function () {
    before(function () {
        this.cartsDao = new Carts()
        mongoose.connect(MongoTestURL)
    })

    beforeEach(function () {
        this.timeout(5000)
    })

    it("Test 1 - Create Carts", async function () {
        this.timeout(5000)
        newCart = await this.cartsDao.createCarts(cartMock)
        expect(newCart).to.have.property("_id")
    })

    it("Test 2 - Get Carts", async function () {
        this.timeout(5000)
        const carts = await this.cartsDao.getCarts()
        expect(carts).to.be.an("array")
    })

    it("Test 3 - Empty cart", async function () {
        this.timeout(5000)
        const cartEmpty = await this.cartsDao.deleteAllProductsinCarts(newCart._id)
        console.log(cartEmpty)
        expect(cartEmpty).to.have.property("products")
        expect(cartEmpty.products).to.be.an("array").that.to.be.empty;
    })

    it("Test 4 - Delete Carts", async function () {
        this.timeout(5000)
        const cartDelete = await this.cartsDao.deleteCarts(newCart._id)
        expect(cartDelete).to.have.property("deletedCount")
        expect(cartDelete.deletedCount).to.be.at.least(1)
    })

    after(function () {
        mongoose.connection.close()
        mongoose.connection.collection("carts").drop()
    })


})