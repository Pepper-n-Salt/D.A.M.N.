import express from "express";
// an dieser Stelle noch die middleware importieren
import {
  showOneExhibition,
  showAllExhibitions,
  createExhibition,
  updateExhibition,
  archiveExhibition,
  deleteExhibition,
} from "../controllers/exhibitionController";
import { checkAuth } from "../middleware/checkAuth";

const router = express.Router();

// in alle routes noch die middleware checkAuth reinschreiben!

router.get("/", checkAuth, showAllExhibitions);

router.get("/:exhibitionId", checkAuth, showOneExhibition);

router.post("/", createExhibition);

router.patch("/:exhibitionId", checkAuth, updateExhibition);
// patch, weil in der Regel wahrscheinlich nur einzelne Felder geändert werden // put wäre der komplette Datensatz zu ändern

router.patch("/:exhibitionId/archive", checkAuth, archiveExhibition);

router.patch("/:exhibitionId/delete", checkAuth, deleteExhibition); // patch, weil Soft Delete, denn mit delete würden wir den Datensatz komplett löschen, hier ändern wir aber nur den "Status" von isDeleted zu true

export default router;
