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

router.get("/:artistID", () => {}, showOneExhibition);

router.get("/all", () => {}, showAllExhibitions);

router.post("/create", () => {}, createExhibition);

router.patch("/update", () => {}, updateExhibition);
// ist patch hier richtig oder lieber put?

router.delete("/archive", () => {}, archiveExhibition); // vllt ist delete hier falsch? gegenchecken!

router.delete("/delete", () => {}, deleteExhibition);

export default router;
