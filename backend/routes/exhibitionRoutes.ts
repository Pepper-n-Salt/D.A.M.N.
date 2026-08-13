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

router.use(checkAuth);

router.get(
  "/:languageCode",
  validateParams(exhibitionLanguageSchema),
  showAllExhibitions
);

router.get(
  "/:exhibitionId/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  showOneExhibition
);

router.post("/", validateBody(createExhibitionSchema), createExhibition);

router.patch(
  "/:exhibitionId/archive",
  validateParams(exhibitionIdSchema),
  archiveExhibition
);

router.patch(
  "/:exhibitionId/delete",
  validateParams(exhibitionIdSchema),
  deleteExhibition
);

router.patch(
  "/:exhibitionId/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  validateBody(updateExhibitionSchema),
  updateExhibition
);

export default router;
