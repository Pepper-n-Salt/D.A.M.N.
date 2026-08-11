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

const router = express.Router();

router.get("/", showAllExhibitions); // hinterher wieder middleware einfügen

router.get("/:exhibitionId", showOneExhibition); // hier auch nach dem testen wieder middlewae einfügen

router.post("/", createExhibition); // hier auch nach dem testen wieder middlewae einfügen

router.patch("/:exhibitionId", () => {}, updateExhibition);
// patch, weil in der Regel wahrscheinlich nur einzelne Felder geändert werden // put wäre der komplette Datensatz zu ändern

router.patch("/:exhibitionId/archive", () => {}, archiveExhibition);

router.patch("/:exhibitionId", () => {}, deleteExhibition); // patch, weil Soft Delete, denn mit delete würden wir den Datensatz komplett löschen, hier ändern wir aber nur den "Status" von isDeleted zu true

export default router;
