import { Router } from "express"
import { getProducts, getProductsById, createProducts, updateProducts, deleteProducts } from "../controllers/products.controller.js"
export const router = Router()

router.get("/", async (req, res) => {
    const productsData = await getProducts(req, res);
    res.json(productsData);
});

router.get("/:pid", getProductsById);

router.post("/", createProducts);

router.put("/:pid", updateProducts)

router.delete("/:pid", deleteProducts)