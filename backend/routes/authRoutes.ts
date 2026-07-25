import express from "express";
import { register, login, logout, getMe } from "../controllers/authController";
// an dieser Stelle später die Auth Middleware importieren

const router = express.Router();

router.post("/register", register); // brauchen wir diese überhaupt? haben wir ja bisher nicht in die Oerfläche mit eingeplant. // vllt schreiben wir hierfür eine weitere Middleware, mit der nur wir beide Zugriff auf die Register haben :)!?
router.post("/login", login);
router.post("/logout", logout); // hier keine middleware checkAuth, damit logout unter allen umständen funktioniert

// route für aktuelle:n user:in, um eingelogged zu bleiben // noch middleware checkAuth und getProfile-controller-function einfügen
router.get("/profile", () => {}, getMe);

export default router;
