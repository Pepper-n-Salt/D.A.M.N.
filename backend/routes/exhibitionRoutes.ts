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

router.get("/", () => {}, showAllExhibitions);

router.get("/:exhibitionId", () => {}, showOneExhibition);

router.post("/", () => {}, createExhibition);

router.patch("/:exhibitionId", () => {}, updateExhibition);
// patch, weil in der Regel wahrscheinlich nur einzelne Felder geändert werden // put wäre den kompletten Datensatz zu ändern

router.patch("/:exhibitionId/archive", () => {}, archiveExhibition);

router.delete("/:exhibitionId", () => {}, deleteExhibition);

export default router;
