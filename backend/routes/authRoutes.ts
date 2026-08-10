import express from "express";
import { checkAuth } from "../middleware/checkAuth.ts";
import { register, login, logout, getMe } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout); // hier keine middleware checkAuth, damit logout unter allen umständen funktioniert
router.get("/profile", checkAuth, getMe);

export default router;
