import express from "express";
// an dieser Stelle noch die middleware importieren
import {
  showOneArtist,
  showAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../controllers/artistController";

const router = express.Router();

router.get("/:artistID", () => {}, showOneArtist);

router.get("/all", () => {}, showAllArtists);

router.post("/create", () => {}, createArtist);

router.patch("/update", () => {}, updateArtist);
// ist patch hier richtig oder lieber put?

router.delete("/delete", () => {}, deleteArtist);

export default router;
