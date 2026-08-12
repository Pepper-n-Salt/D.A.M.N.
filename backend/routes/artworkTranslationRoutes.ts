import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  createArtworkTranslation,
  updateArtworkTranslation,
} from "../controllers/artworkTranslationController.js";

const router = express.Router();

router.post("/:artworkId/translations", checkAuth, createArtworkTranslation);

router.patch(
  "/:artworkId/translations/:languageCode",
  checkAuth,
  updateArtworkTranslation
);

export default router;
