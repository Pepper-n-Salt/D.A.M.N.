import express from "express";

import { showPublicExhibition } from "../controllers/exhibitionController.js";

import { validateParams } from "../middleware/validate.js";

import { exhibitionIdLanguageParamsSchema } from "../schemas/exhibitionSchema.js";

const router = express.Router();

router.get(
  "/public/:exhibitionId/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  showPublicExhibition
);

export default router;
