import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  showOneExhibition,
  showAllExhibitions,
  createExhibition,
  updateExhibition,
  archiveExhibition,
  deleteExhibition,
} from "../controllers/exhibitionController.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import {
  exhibitionIdSchema,
  exhibitionLanguageSchema,
  exhibitionIdLanguageParamsSchema,
  createExhibitionSchema,
  updateExhibitionSchema,
} from "../schemas/exhibitionSchema.js";

const router = express.Router();

// in alle routes noch die middleware checkAuth reinschreiben!

router.get(
  "/:languageCode",
  checkAuth,
  validateParams(exhibitionLanguageSchema),
  showAllExhibitions
);

router.get(
  "/:exhibitionId/:languageCode",
  checkAuth,
  validateParams(exhibitionIdLanguageParamsSchema),
  showOneExhibition
);

router.post(
  "/",
  checkAuth,
  validateBody(createExhibitionSchema),
  createExhibition
);

router.patch(
  "/:exhibitionId/archive",
  checkAuth,
  validateParams(exhibitionIdSchema),
  archiveExhibition
);

router.patch(
  "/:exhibitionId/delete",
  checkAuth,
  validateParams(exhibitionIdSchema),
  deleteExhibition
);

router.patch(
  "/:exhibitionId/:languageCode",
  checkAuth,
  validateParams(exhibitionIdLanguageParamsSchema),
  validateBody(updateExhibitionSchema),
  updateExhibition
);

export default router;
