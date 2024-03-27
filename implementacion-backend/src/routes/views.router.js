import { Router } from "express";
import { getProducts } from "../controllers/products.controller.js";
import { getCartsById } from "../controllers/carts.controller.js"
import { checkRole } from "../middlewares/checkRole.js"
import UserDTO from "../dto/user.dto.js";
import Carts from "../dao/classes/carts.dao.js"
import Tickets from "../dao/classes/tickets.dao.js";
import { getTicketById } from "../controllers/tickets.controller.js";
const cartsService = new Carts()

export const router = Router()

router.get("/products", async (req, res) => {
    const productsData = await getProducts(req, res);

    res.render("products", {
        style: "index.css",
        products: productsData.payload.docs,
        prevLink: productsData.prevLink,
        nextLink: productsData.nextLink,
    });
});

router.get("/carts/:cid", checkRole(['user']), async (req, res) => {
    const cartData = await getCartsById(req, res);

    res.render("carts", {
        style: "index.css",
        cart: cartData.payload
    });
});

router.get("/current", checkRole(['user', "admin"]), (req, res) => {
    const userDTO = new UserDTO(req.session.user)
    res.render("profile", {
        style: "index.css",
        user: userDTO
    })
})

router.get("/register", (req, res) => {
    res.render("register", {
        style: "index.css",
        user: req.session.user
    })
})

router.get("/login", (req, res) => {
    res.render("login", {
        style: "index.css",
        user: req.session.user
    })
})

router.get('/restartPassword', (req, res) => {
    res.render('restartPassword', {
        style: "index.css",
        user: req.session.user
    })
})

router.get("/admin", checkRole(['admin']), (req, res) => {
    res.render("admin", {})
})

router.get("/myCart", checkRole(['user']), async (req, res) => {
    try {
        const user = req.user;
        const userCartId = user.carts[0];

        const userCart = await cartsService.getCartsById({ _id: userCartId });

        if (userCart && userCart.products) {
            let totalAmount = 0;
            userCart.products.forEach(product => {
                totalAmount += product.product.price * product.quantity;
            });

            res.render('cart', { style: "index.css", userCart, totalAmount });
        } else {
            console.error("userCart or its products property is null or undefined");

            res.render('cart', { style: "index.css", userCart: null, totalAmount: 0 });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});



router.get('/tickets/:id', getTicketById)

router.get("/chat", checkRole(['user']), (req, res) => {
    res.render("chat", {
      style: "index.css"
    })
  })
  
