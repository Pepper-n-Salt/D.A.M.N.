import express from "express";
// an dieser Stelle noch die middleware importieren
import {
  showAllArtworks,
  showOneArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from "../controllers/artworkController";

const router = express.Router();

router.get("/", () => {}, showAllArtworks);

router.get("/:artworkId", () => {}, showOneArtwork);

router.post("/", () => {}, createArtwork);

router.patch("/:artworkId", () => {}, updateArtwork);

router.delete("/:artworkId", () => {}, deleteArtwork);

export default router;
