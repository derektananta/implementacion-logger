import { expect } from "chai"
import config from "../../src/config/config.js"
import mongoose from "mongoose"
import Products from "../../src/dao/classes/products.dao.js"

const { MongoTestURL } = config

const productMock = {
    title: "Ball",
    description: "Great ball",
    price: 300,
    thumbnail: "image",
    code: "abc123",
    stock: 30,
    category: "sports",
}

let newProduct;

describe("Testing products Dao", function () {

    before(function () {
        this.productsDao = new Products()
        mongoose.connect(MongoTestURL)
    })

    beforeEach(function () {
        this.timeout(5000)
    })

    it("Test 1 - Create products", async function () {
        this.timeout(5000)
        newProduct = await this.productsDao.createProducts(
            productMock.title,
            productMock.description,
            productMock.price,
            productMock.thumbnail,
            productMock.code,
            productMock.stock,
            productMock.category
        )

        expect(newProduct).to.have.property("_id")
    })

    it("Test 2 - Get products", async function () {
        this.timeout(5000)
        const products = await this.productsDao.getProducts()
        console.log(products)
        expect(products).to.be.an("object")
        expect(products).to.have.property("docs")
        expect(products.docs).to.be.an("array")
    })

    it("Test 3 - Get products by Id", async function () {
        this.timeout(5000)
        const productObtained = await this.productsDao.getProductsById(newProduct._id)
        console.log(`Product obtained: ${productObtained.title}`)
        expect(productObtained).to.be.an("object")
        expect(productObtained).to.have.property("title")
    })

    it("Test 4 - Update products", async function () {
        this.timeout(5000)
        const productMock2 = {
            title: "Ball",
            description: "Great ball",
            price: 300,
            thumbnail: "image 2",
            code: "abc123",
            stock: 30,
            category: "sports",
        }

        const updateProduct = await this.productsDao.updateProducts(newProduct._id, productMock)

        Object.keys(productMock2).forEach(key => {
            if (newProduct[key] !== productMock2[key]) {
                console.log(`Propery ${key} updated | ${newProduct[key]} => ${productMock2[key]}`);
            }
        });

        expect(updateProduct).to.be.an("object")
        expect(updateProduct).to.have.property("matchedCount")
        expect(updateProduct.matchedCount).to.be.at.least(1);
    })

    it("Test 5 - Delete products", async function () {
        this.timeout(5000)
        const productDeleted = await this.productsDao.deleteProducts(newProduct._id)
        expect(productDeleted).to.have.property("deletedCount")
        expect(productDeleted.deletedCount).to.be.at.least(1);

    })

    after(function () {
        mongoose.connection.close()
        mongoose.connection.collection("products").drop()
    })

})