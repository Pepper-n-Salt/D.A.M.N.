import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { validateParams, validateBody } from "../middleware/validate.js";
import {
  createArtistTranslation,
  updateArtistTranslation,
} from "../controllers/artistTranslationController.js";
import {
  artistIdSchema,
  artistIdLanguageParamsSchema,
} from "../schemas/artistSchema.js";
import {
  createArtistTranslationSchema,
  updateArtistTranslationSchema,
} from "../schemas/artistTranslationSchema.js";

const router = express.Router();

router.use(checkAuth);

router.post(
  "/:artistId/translations",
  validateParams(artistIdSchema),
  validateBody(createArtistTranslationSchema),
  createArtistTranslation
);

router.patch(
  "/:artistId/translations/:languageCode",
  validateParams(artistIdLanguageParamsSchema),
  validateBody(updateArtistTranslationSchema),
  updateArtistTranslation
);

export default router;
