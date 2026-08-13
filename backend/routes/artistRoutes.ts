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
  artistLanguageSchema,
  artistIdLanguageParamsSchema,
  createArtistSchema,
  updateArtistSchema,
} from "../schemas/artistSchema.js";

const router = express.Router();

router.use(checkAuth);

router.get(
  "/:languageCode",
  validateParams(artistLanguageSchema),
  showAllArtists
);

router.get(
  "/:artistId/:languageCode",
  validateParams(artistIdLanguageParamsSchema),
  showOneArtist
);

router.post("/", validateBody(createArtistSchema), createArtist);

// Soft Delete
router.patch("/:artistId", validateParams(artistIdSchema), deleteArtist);

// Artist inkl. Translation aktualisieren
router.patch(
  "/:artistId/:languageCode",
  validateParams(artistIdLanguageParamsSchema),
  validateBody(updateArtistSchema),
  updateArtist
);

export default router;
