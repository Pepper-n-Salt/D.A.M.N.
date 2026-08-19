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
  restoreExhibition,
  setExhibitionScreen,
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

// Alle gelöschten Exhibitions abrufen (geht nur für SuperUser)
router.get(
  "/deleted/:languageCode",
  requireSuperUser,
  validateParams(exhibitionLanguageSchema),
  showDeletedExhibitions
);

// Alle nicht gelöschten Exhibitions abrufen
router.get(
  "/:languageCode",
  validateParams(exhibitionLanguageSchema),
  showAllExhibitions
);

// Nur eine einzelne Exhibtion abrufen
router.get(
  "/:exhibitionId/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  showOneExhibition
);

// Eine neue Exhibtion anlegen
router.post("/", validateBody(createExhibitionSchema), createExhibition);

// Eine Exhibition archivieren
router.patch(
  "/:exhibitionId/archive",
  validateParams(exhibitionIdSchema),
  archiveExhibition
);

// Eine Exhibition löschen (Soft Delete)
router.patch(
  "/:exhibitionId/delete",
  validateParams(exhibitionIdSchema),
  deleteExhibition
);

// Eine Exhibtion wiederherstellen (geht nur für Superuser)
router.patch(
  "/:exhibitionId/restore",
  requireSuperUser,
  validateParams(exhibitionIdSchema),
  restoreExhibition
);

// Eine Exhibition aktualisieren / editieren
router.patch(
  "/:exhibitionId/:languageCode",
  validateParams(exhibitionIdLanguageParamsSchema),
  validateBody(updateExhibitionSchema),
  updateExhibition
);

// Eine Exhibition als Screen markieren
router.patch(
  "/:exhibitionId/:languageCode/screen",
  validateParams(exhibitionIdLanguageParamsSchema),
  setExhibitionScreen
); // hier noch weiterschreiben

export default router;
