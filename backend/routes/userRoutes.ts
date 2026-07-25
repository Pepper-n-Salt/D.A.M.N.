import express from "express";
// an dieser Stelle später die Auth Middleware importieren
import {
  showAllUsers,
  showUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.get("/", () => {}, showAllUsers);
router.get("/:userId", () => {}, showUser); // zum Abrufen der:s User:in zur Darstellung in User Form?
router.post("/", () => {}, createUser); // zum Anlegen von neuen User:innen in der User Form // brauchen wir das hier? oder kann hier dann auch die auth/register verwendet werden?
router.patch("/:userId", () => {}, updateUser);
router.delete("/:userId", () => {}, deleteUser);

export default router;
