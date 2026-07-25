import express from "express";
// an dieser Stelle noch die middleware importieren
import {
  createArtwork,
  showOneArtwork,
  showAllArtworks,
  updateArtwork,
  deleteArtwork,
} from "../controllers/artworkController";

const router = express.Router();

router.get("/:artworkID", () => {}, showOneArtwork);

router.get("/all", () => {}, showAllArtworks);

router.post("/create", () => {}, createArtwork);

router.patch("/update", () => {}, updateArtwork);
// ist patch hier richtig oder lieber put?

router.delete("/delete", () => {}, deleteArtwork);

export default router;
