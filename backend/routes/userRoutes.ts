import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { validateParams, validateBody } from "../middleware/validate.js";
import {
  showAllUsers,
  showUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import {
  userIdSchema,
  createUserSchema,
  updateUserSchema,
} from "../schemas/userSchema.ts";

const router = express.Router();

router.use(checkAuth);

router.get("/", showAllUsers);
router.get("/:userId", validateParams(userIdSchema), showUser); // zum Abrufen der:s User:in zur Darstellung in User Form?
router.post("/", validateBody(createUserSchema), createUser); // zum Anlegen von neuen User:innen in der User Form
router.patch(
  "/:userId",
  validateParams(userIdSchema),
  validateBody(updateUserSchema),
  updateUser
);
router.delete("/:userId", validateParams(userIdSchema), deleteUser);

export default router;
