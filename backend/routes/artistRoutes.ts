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

router.get("/", () => {}, showAllArtists);

router.get("/:artistId", () => {}, showOneArtist);

router.post("/", () => {}, createArtist);

router.patch("/:artistId", () => {}, updateArtist);

router.delete("/:artistId", () => {}, deleteArtist);

export default router;
