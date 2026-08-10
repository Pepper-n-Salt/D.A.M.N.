import express from "express";
import { checkAuth } from "../middleware/checkAuth.ts";
import {
  showAllUsers,
  showUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = express.Router();

router.use(checkAuth);

router.get("/", showAllUsers);
router.get("/:userId", showUser); // zum Abrufen der:s User:in zur Darstellung in User Form?
router.post("/", createUser); // zum Anlegen von neuen User:innen in der User Form
router.patch("/:userId", updateUser);
router.delete("/:userId", deleteUser);

export default router;
