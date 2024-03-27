import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { createHash } from "../utils.js";
import passport from "passport";
import { getUserCartId, getUserCart } from "../controllers/carts.controller.js";

export const router = Router()

router.post('/register', passport.authenticate('register', {
    failureRedirect: '/failregister',
    session: false
}), async (req, res) => {
    res.send({ status: "success", message: "User registered" });
})

router.get('/failregister', async (req, res) => {
    res.send({ error: 'failed' })
})

router.post('/login', passport.authenticate('login', {
    failureRedirect: '/faillogin'
}), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Incomplete Values" });

    req.session.user = {
        name: req.user.first_name + " " + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }

    res.send({ status: "success", payload: req.user });
})

router.get('/faillogin', async (req, res) => {
    res.send({ error: 'failed' })
})

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })
router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = {
        name: req.user.first_name + req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: req.user.rol
    }
    res.redirect("/profile")
})


router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.json({ status: "Logout ERROR", body: err })
        }
        res.send("Logout Ok")
    })
})

router.post('/restartPassword', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete Values" });
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ status: "error", error: "Not user found" });
    const newHashedPassword = createHash(password);
    await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });
    res.send({ status: "success", message: "Password restarted" });
})

router.get("/cartId", getUserCartId)
router.get("/myCart", getUserCart)
