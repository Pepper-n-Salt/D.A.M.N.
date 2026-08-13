import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  showOneArtist,
  showAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../controllers/artistController.js";

const router = express.Router();

router.get("/", checkAuth, showAllArtists);

router.get("/:artistId", checkAuth, showOneArtist);

router.post("/", checkAuth, createArtist);

router.patch("/:artistId", checkAuth, deleteArtist);

router.patch("/:artistId/:languageCode", checkAuth, updateArtist);

export default router;
