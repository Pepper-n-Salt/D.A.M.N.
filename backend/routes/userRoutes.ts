import express from "express";
// an dieser Stelle später die Auth Middleware importieren
import { showUser, createNewUser } from "../controllers/userController";

const router = express.Router();

router.get("/:userId", () => {}, showUser); // zum Abrufen der:s User:in zur Darstellung in User Form?
router.post("/", () => {}, createNewUser); // zum Anlegen von neuen User:innen in der User Form // brauchen wir das hier? oder kann hier dann auch die auth/register verwendet werden?

export default router;
