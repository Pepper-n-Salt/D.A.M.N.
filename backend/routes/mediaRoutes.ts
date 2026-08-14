import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { uploadMedia } from "../controllers/mediaController.js";

const router = express.Router();

router.post("/uploadImage", checkAuth, uploadMedia);

export default router;
