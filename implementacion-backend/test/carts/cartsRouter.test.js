import supertest from "supertest";
import { expect } from "chai";

const url = supertest("http://localhost:8080")

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

const productMock = {
    title: "Ball",
    description: "Great ball",
    price: 300,
    thumbnail: "image",
    code: "abc123",
    stock: 30,
    category: "sports",
}


let newCart;
let newProduct;

describe("Testing Carts routes w/ products", async function () {

    it("Test 1 - [POST] /api/products - [POST] /api/carts | Create Cart & Products", async function () {
        newCart = await url.post("/api/carts").send(cartMock)
        expect(newCart.statusCode).to.be.eql(200)

        newProduct = await url.post("/api/products").send(productMock)
        expect(newProduct.statusCode).to.be.eql(200)
    })

    it("Test 2 - [GET] /api/carts/:cid | Get cart by Id", async function () {
        const cid = newCart._body.payload._id
        const getCartById = await url.get(`/api/carts/${cid}`)

        expect(getCartById.statusCode).to.be.eql(200)
        expect(getCartById.body.payload).to.have.property("_id")
        expect(getCartById.body.payload).to.have.property("products").that.to.be.an("array")
    })

    it("Test 3 - [POST] /api/carts/:cid/products/:pid | Add products to Cart", async function () {

        const cid = newCart._body.payload._id
        const pid = newProduct._body.payload._id
        const addProducts = await url.post(`/api/carts/${cid}/products/${pid}`)
        expect(addProducts.statusCode).to.be.eql(200)
        expect(addProducts.body.payload).to.have.property("_id")
        expect(addProducts.body.payload).to.have.property("products").that.to.be.an("array").that.is.not.empty

        const firstProduct = addProducts.body.payload.products[0]
        expect(firstProduct).to.have.property("product").that.is.an("object").that.is.not.empty
        expect(firstProduct).to.have.property("quantity").that.is.at.least(1)
        expect(firstProduct).to.have.property("_id").that.is.not.empty
    })

    it("Test 4 - [PUT] /api/carts/:cid/products/:pid | Update product quantity in Cart", async function () {
        const productQuantity = { "quantity": 10 + 1 }
        const cid = newCart._body.payload._id
        const pid = newProduct._body.payload._id
        const updateProductQuantity = await url.put(`/api/carts/${cid}/products/${pid}`).send(productQuantity)
        expect(updateProductQuantity.statusCode).to.be.eql(200)
        expect(updateProductQuantity.body.payload.products[0]).to.have.property("quantity").that.is.at.least(10)
    })

    it("Test 5 - [DELETE] /api/carts/:cid/products/:pid | Delete product in cart", async function () {
        const cid = newCart._body.payload._id
        const pid = newProduct._body.payload._id

        const cart = await url.delete(`/api/carts/${cid}/products/${pid}`)
        console.log(pid)
        console.log(cart.body.payload.products)
    })

})