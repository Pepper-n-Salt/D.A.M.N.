import express from "express";

import { checkAuth } from "../middleware/checkAuth.js";
import { requireSuperUser } from "../middleware/requireSuperUser.js";
import { validateBody, validateParams } from "../middleware/validate.js";

import {
  showOneArtist,
  showAllArtists,
  showDeletedArtists,
  createArtist,
  updateArtist,
  deleteArtist,
  restoreArtist,
} from "../controllers/artistController.js";

import {
  artistIdSchema,
  artistLanguageSchema,
  artistIdLanguageParamsSchema,
  createArtistSchema,
  updateArtistSchema,
} from "../schemas/artistSchema.js";

const router = express.Router();

/*
 * Alle Artist-Routen benötigen Authentifizierung.
 */
router.use(checkAuth);

/*
 * --------------------------------------------------------------------------
 * Alle Artists
 * GET /artist/:languageCode
 * --------------------------------------------------------------------------
 */

router.get(
  "/:languageCode",
  validateParams(artistLanguageSchema),
  showAllArtists
);

/*
 * --------------------------------------------------------------------------
 * Gelöschte Artists
 * GET /artist/deleted/:languageCode
 * --------------------------------------------------------------------------
 */

router.get(
  "/deleted/:languageCode",
  requireSuperUser,
  validateParams(artistLanguageSchema),
  showDeletedArtists
);

/*
 * --------------------------------------------------------------------------
 * Einen Artist laden
 * GET /artist/:artistId/:languageCode
 * --------------------------------------------------------------------------
 */

router.get(
  "/:artistId/:languageCode",
  validateParams(artistIdLanguageParamsSchema),
  showOneArtist
);

/*
 * --------------------------------------------------------------------------
 * Artist erstellen
 * POST /artist
 * --------------------------------------------------------------------------
 */

router.post(
  "/",
  requireSuperUser,
  validateBody(createArtistSchema),
  createArtist
);

/*
 * --------------------------------------------------------------------------
 * Artist löschen
 * PATCH /artist/:artistId/delete
 * --------------------------------------------------------------------------
 */

router.patch(
  "/:artistId/delete",
  requireSuperUser,
  validateParams(artistIdSchema),
  deleteArtist
);

router.patch(
  "/:artistId/restore",
  requireSuperUser,
  validateParams(artistIdSchema),
  restoreArtist
);

/*
 * --------------------------------------------------------------------------
 * Artist aktualisieren
 * PATCH /artist/:artistId/:languageCode
 * --------------------------------------------------------------------------
 */
router.patch(
  "/:artistId/:languageCode",
  requireSuperUser,
  validateParams(artistIdLanguageParamsSchema),
  validateBody(updateArtistSchema),
  updateArtist
);

export default router;
