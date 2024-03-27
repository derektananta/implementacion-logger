import { Router } from "express";
import { faker } from "@faker-js/faker";
import { getPrevLink, getNextLink } from "../utils.js";

export const router = Router()

const generateMockProducts = (req, res) => {
    const numProducts = 100;
    const pageSize = 10;

    const page = parseInt(req.query.page) || 1;
    const totalPages = Math.ceil(numProducts / pageSize);
    const startIdx = (page - 1) * pageSize;
    const endIdx = startIdx + pageSize;

    const products = [];

    for (let i = startIdx; i < endIdx && i < numProducts; i++) {
        const product = {
            id: faker.database.mongodbObjectId(),
            title: faker.commerce.productName(),
            description: faker.lorem.sentence(),
            price: faker.commerce.price(),
            image: faker.image.url(),
            category: faker.commerce.department(),
        };

        products.push(product);
    }

    const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

    const prevLink = page > 1 ? getPrevLink(baseUrl, { page, prevPage: page - 1 }) : null;
    const nextLink = page < totalPages ? getNextLink(baseUrl, { page, nextPage: page + 1 }) : null;

    return {
        status: "success",
        payload: products,
        prevLink,
        nextLink,
    };
}

router.get("/mockingproducts", (req, res) => {
    const mockdata = generateMockProducts(req, res);

    res.render("mock", {
        style: "index.css",
        products: mockdata.payload,
        prevLink: mockdata.prevLink,
        nextLink: mockdata.nextLink,
    });
});

