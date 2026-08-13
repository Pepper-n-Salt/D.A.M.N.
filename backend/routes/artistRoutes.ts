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

router.patch("/:artistId", checkAuth, deleteArtist); // validateParams(artistIdSchema)

router.patch("/:artistId/:languageCode", checkAuth, updateArtist); // validateParams(artistLanguageParamsSchema)

export default router;
