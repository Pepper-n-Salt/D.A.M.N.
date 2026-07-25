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

router.get("/:artistId", () => {}, showOneExhibition);

router.get("/all", () => {}, showAllExhibitions);

router.post("/", () => {}, createExhibition);

router.patch("/:artistId", () => {}, updateExhibition);
// patch, weil in der Regel wahrscheinlich nur einzelne Felder geändert werden // put wäre den kompletten Datensatz zu ändern

router.patch("/:artistId/archive", () => {}, archiveExhibition);

router.delete("/:artistId", () => {}, deleteExhibition);

export default router;
