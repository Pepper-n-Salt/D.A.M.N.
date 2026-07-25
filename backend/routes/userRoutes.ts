import express from "express";
import { showUser, createNewUser } from "../controllers/userController";
// an dieser Stelle später die Auth Middleware importieren

const router = express.Router();

router.get("/:userId", () => {}, showUser); // zum Abrufen der:s User:in zur Darstellung in User Form?
router.post("/register", () => {}, createNewUser); // zum Anlegen von neuen User:innen in der User Form

export default router;
