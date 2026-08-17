import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { validateBody } from "../middleware/validate.js";
import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../schemas/authSchema.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.post("/logout", logout); // hier keine middleware checkAuth, damit logout unter allen Umständen funktioniert
router.get("/profile", checkAuth, getMe);

export default router;
