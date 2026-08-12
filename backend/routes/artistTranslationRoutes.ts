import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  createArtistTranslation,
  updateArtistTranslation,
} from "../controllers/artistTranslationController.js";

const router = express.Router();

router.post("/:artistId/translations", checkAuth, createArtistTranslation);

router.patch(
  "/:artistId/translations/:languageCode",
  checkAuth,
  updateArtistTranslation
);

export default router;
