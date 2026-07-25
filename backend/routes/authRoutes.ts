import express from "express";
// an dieser Stelle später die Auth Middleware importieren
import { register, login, logout, getMe } from "../controllers/authController";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout); // hier keine middleware checkAuth, damit logout unter allen umständen funktioniert

// route für aktuelle:n user:in, um eingelogged zu bleiben // noch middleware checkAuth einfügen
router.get("/profile", () => {}, getMe);

export default router;
