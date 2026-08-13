import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { validateBody, validateParams } from "../middleware/validate.js";
import {
  showOneArtist,
  showAllArtists,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../controllers/artistController.js";
import {
  artistIdSchema,
  createArtistSchema,
  artistLanguageParamsSchema,
  updateArtistSchema,
} from "../schemas/artistSchema.js";

const router = express.Router();

router.get("/", checkAuth, showAllArtists);

router.get(
  "/:artistId",
  checkAuth,
  validateParams(artistIdSchema),
  showOneArtist
);

router.post("/", checkAuth, validateBody(createArtistSchema), createArtist);

// Soft Delete
router.patch(
  "/:artistId",
  checkAuth,
  validateParams(artistIdSchema),
  deleteArtist
);

// Artist inkl. Translation aktualisieren
router.patch(
  "/:artistId/:languageCode",
  checkAuth,
  validateParams(artistLanguageParamsSchema),
  validateBody(updateArtistSchema),
  updateArtist
);

export default router;
