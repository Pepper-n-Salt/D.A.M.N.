import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  createArtistTranslation,
  updateArtistTranslation,
} from "../controllers/artistTranslationController.js";
import { check } from "zod";

const router = express.Router();

router.use(checkAuth);

router.post("/:artistId/translations", createArtistTranslation);

router.patch("/:artistId/translations/:languageCode", updateArtistTranslation);

export default router;
