import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { validateParams, validateBody } from "../middleware/validate.js";
import {
  createExhibitionTranslation,
  updateExhibitionTranslation,
} from "../controllers/exhibitionTranslationController.js";
import {
  exhibitionIdSchema,
  exhibitionIdLanguageParamsSchema,
} from "../schemas/exhibitionSchema.js";
import {
  createExhibitionTranslationSchema,
  updateExhibitionTranslationSchema,
} from "../schemas/exhibitionTranslationSchema.js";

const router = express.Router();

router.use(checkAuth);

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
