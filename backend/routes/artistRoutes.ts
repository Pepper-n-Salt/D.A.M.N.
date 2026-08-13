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

router.get("/:artistId", checkAuth, showOneArtist); // hier noch validateParams(artistIdSchema) rein

router.post("/", checkAuth, createArtist); // validateBody(createArtistSchema)

// Soft Delete
router.patch("/:artistId", checkAuth, deleteArtist); // validateParams(artistIdSchema)

// Artist inkl. Translation aktualisieren
router.patch("/:artistId/:languageCode", checkAuth, updateArtist); // validateParams(artistLanguageParamsSchema)

export default router;
