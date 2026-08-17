import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { requireSuperUser } from "../middleware/requireSuperUser.js";

import {
  showOneExhibition,
  showAllExhibitions,
  showDeletedExhibitions,
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

/*
 * --------------------------------------------------------------------------
 * GELÖSCHTE EXHIBITIONS
 * --------------------------------------------------------------------------
 *
 * Nur Super-User dürfen gelöschte Exhibitions sehen.
 *
 * Beispiel:
 * GET /exhibition/deleted/de
 */

router.get(
  "/deleted/:languageCode",
  requireSuperUser,
  validateParams(exhibitionLanguageSchema),
  showDeletedExhibitions
);

/*
 * --------------------------------------------------------------------------
 * ALLE AKTUELLEN EXHIBITIONS
 * --------------------------------------------------------------------------
 */

router.get(
  "/:languageCode",
  validateParams(exhibitionLanguageSchema),
  showAllExhibitions
);

/*
 * --------------------------------------------------------------------------
 * EINE EXHIBITION
 * --------------------------------------------------------------------------
 */

router.get(
  "/:exhibitionId/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  showOneExhibition
);

/*
 * --------------------------------------------------------------------------
 * NEUE EXHIBITION
 * --------------------------------------------------------------------------
 */

router.post("/", validateBody(createExhibitionSchema), createExhibition);

/*
 * --------------------------------------------------------------------------
 * ARCHIVIEREN
 * --------------------------------------------------------------------------
 */

router.patch(
  "/:exhibitionId/archive",
  validateParams(exhibitionIdSchema),
  archiveExhibition
);

/*
 * --------------------------------------------------------------------------
 * LÖSCHEN
 * --------------------------------------------------------------------------
 */

router.patch(
  "/:exhibitionId/delete",
  validateParams(exhibitionIdSchema),
  deleteExhibition
);

/*
 * --------------------------------------------------------------------------
 * EXHIBITION BEARBEITEN
 * --------------------------------------------------------------------------
 */

router.patch(
  "/:exhibitionId/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  validateBody(updateExhibitionSchema),
  updateExhibition
);

export default router;
