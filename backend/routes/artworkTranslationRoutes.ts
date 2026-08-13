import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  createArtworkTranslation,
  updateArtworkTranslation,
} from "../controllers/artworkTranslationController.js";

const router = express.Router();

router.use(checkAuth);

router.post("/:artworkId/translations", createArtworkTranslation);

router.patch(
  "/:artworkId/translations/:languageCode",
  updateArtworkTranslation
);

export default router;
