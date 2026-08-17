import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { validateParams, validateBody } from "../middleware/validate.js";
import {
  createExhibitionTranslation,
  updateExhibitionTranslation,
  previewExhibitionTranslation,
} from "../controllers/exhibitionTranslationController.js";
import {
  exhibitionIdSchema,
  exhibitionIdLanguageParamsSchema,
} from "../schemas/exhibitionSchema.js";
import {
  createExhibitionTranslationSchema,
  updateExhibitionTranslationSchema,
  previewExhibitionTranslationSchema,
} from "../schemas/exhibitionTranslationSchema.js";

const router = express.Router();

router.use(checkAuth);

/*
  NEU:

  Translate-Preview.

  Dieser Endpoint übersetzt die Exhibition,
  speichert aber noch nichts.

  Das Ergebnis wird vom Frontend verwendet,
  um das zweite Formular vorauszufüllen.
*/
router.post(
  "/:exhibitionId/translations/preview",
  validateParams(exhibitionIdSchema),
  validateBody(previewExhibitionTranslationSchema),
  previewExhibitionTranslation
);

router.post(
  "/:exhibitionId/translations",
  validateParams(exhibitionIdSchema),
  validateBody(createExhibitionTranslationSchema),
  createExhibitionTranslation
);

router.patch(
  "/:exhibitionId/translations/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  validateBody(updateExhibitionTranslationSchema),
  updateExhibitionTranslation
);

export default router;
