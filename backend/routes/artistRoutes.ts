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
  setArtistScreen,
  removeArtistScreen,
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

// Alle gelöschten Artists abrufen (nur für SuperAdmins)
router.get(
  "/deleted/:languageCode",
  requireSuperUser,
  validateParams(artistLanguageSchema),
  showDeletedArtists
);

// Alle Artists abrufen
router.get(
  "/:languageCode",
  validateParams(artistLanguageSchema),
  showAllArtists
);

// Einen einzelnen Artist laden
router.get(
  "/:artistId/:languageCode",
  validateParams(artistIdLanguageParamsSchema),
  showOneArtist
);

// Einen neuen Artist erstellen
router.post("/", validateBody(createArtistSchema), createArtist);

// Einen Artist löschen (Soft Delete)
router.patch(
  "/:artistId/delete",
  requireSuperUser,
  validateParams(artistIdSchema),
  deleteArtist
);

// Einen Artist wiederherstellen (geht nur für Super Admins)
router.patch(
  "/:artistId/restore",
  requireSuperUser,
  validateParams(artistIdSchema),
  restoreArtist
);

// Einen Artist aktualisieren / editieren
router.patch(
  "/:artistId/:languageCode",
  validateParams(artistIdLanguageParamsSchema),
  validateBody(updateArtistSchema),
  updateArtist
);

// Einen Artist als Screen markieren
router.patch(
  "/:artistId/:languageCode/screen",
  validateParams(artistIdLanguageParamsSchema),
  setArtistScreen
);

// Einen Artist wieder als Screen entfernen
router.patch(
  "/:artistId/:languageCode/unscreen",
  validateParams(artistIdLanguageParamsSchema),
  removeArtistScreen
);

export default router;
