import express from "express";

import { checkAuth } from "../middleware/checkAuth.js";

import { validateParams, validateBody } from "../middleware/validate.js";

import {
  createArtistTranslation,
  updateArtistTranslation,
  previewArtistTranslation,
} from "../controllers/artistTranslationController.js";

import {
  artistIdSchema,
  artistIdLanguageParamsSchema,
} from "../schemas/artistSchema.js";

import {
  createArtistTranslationSchema,
  updateArtistTranslationSchema,
  previewArtistTranslationSchema,
} from "../schemas/artistTranslationSchema.js";

const router = express.Router();

router.use(checkAuth);

/*
 * --------------------------------------------------------------------------
 * Translation Preview
 * --------------------------------------------------------------------------
 */

router.post(
  "/:artistId/translations/preview",

  validateParams(artistIdSchema),

  validateBody(previewArtistTranslationSchema),

  previewArtistTranslation
);

/*
 * --------------------------------------------------------------------------
 * Neue Translation erstellen
 * --------------------------------------------------------------------------
 */

router.post(
  "/:artistId/translations",

  validateParams(artistIdSchema),

  validateBody(createArtistTranslationSchema),

  createArtistTranslation
);

/*
 * --------------------------------------------------------------------------
 * Translation aktualisieren
 * --------------------------------------------------------------------------
 */

router.patch(
  "/:artistId/translations/:languageCode",

  validateParams(artistIdLanguageParamsSchema),

  validateBody(updateArtistTranslationSchema),

  updateArtistTranslation
);

export default router;
