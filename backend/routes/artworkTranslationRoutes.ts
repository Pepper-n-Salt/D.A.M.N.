import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { validateParams, validateBody } from "../middleware/validate.js";
import {
  createArtworkTranslation,
  updateArtworkTranslation,
} from "../controllers/artworkTranslationController.js";
import {
  artworkIdSchema,
  artworkIdLanguageParamsSchema,
} from "../schemas/artworkSchema.js";
import {
  createArtworkTranslationSchema,
  updateArtworkTranslationSchema,
} from "../schemas/artworkTranslationSchema.js";

const router = express.Router();

router.use(checkAuth);

router.post(
  "/:artworkId/translations",
  validateParams(artworkIdSchema),
  validateBody(createArtworkTranslationSchema),
  createArtworkTranslation
);

router.patch(
  "/:artworkId/translations/:languageCode",
  validateParams(artworkIdLanguageParamsSchema),
  validateBody(updateArtworkTranslationSchema),
  updateArtworkTranslation
);

export default router;
