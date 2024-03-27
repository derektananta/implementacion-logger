import { Router } from "express"
import {
    createCarts, getCartsById, addProductToCarts, getCarts, deleteCarts, deleteProductInCarts,
    updateCarts, updateQuantityProductsInCarts, deleteAllProductsinCarts, purchaseCart
} from "../controllers/carts.controller.js"

export const router = Router()
router.get("/", getCarts)
router.get("/:cid", async (req, res) => {
    const cartData = await getCartsById(req, res);
    res.json(cartData)
})

router.put("/:cid", updateCarts)
router.put("/:cid/products/:pid", updateQuantityProductsInCarts)
router.put("/empty/:cid", deleteAllProductsinCarts)


router.post("/", createCarts)
router.post("/:cid/products/:pid", addProductToCarts)
router.post("/:cid", purchaseCart);


router.delete("/:cid", deleteCarts)
router.delete("/:cid/products/:pid", deleteProductInCarts)

