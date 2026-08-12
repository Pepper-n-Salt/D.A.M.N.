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
  createExhibitionSchema,
  updateExhibitionSchema,
} from "../schemas/exhibitionSchema.js";

const router = express.Router();

// in alle routes noch die middleware checkAuth reinschreiben!

router.get("/", checkAuth, showAllExhibitions);

router.get(
  "/:exhibitionId",
  checkAuth,
  validateParams(exhibitionIdSchema),
  showOneExhibition
);

router.post(
  "/",
  checkAuth,
  validateBody(createExhibitionSchema),
  createExhibition
);

router.patch(
  "/:exhibitionId",
  checkAuth,
  validateParams(exhibitionIdSchema),
  validateBody(updateExhibitionSchema),
  updateExhibition
);
// patch, weil in der Regel wahrscheinlich nur einzelne Felder geändert werden // put wenn kompletter Datensatz geändert wird

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
); // patch, weil Soft Delete, denn mit delete würden wir den Datensatz komplett löschen, hier ändern wir aber nur den "Status" von isDeleted zu true

export default router;
