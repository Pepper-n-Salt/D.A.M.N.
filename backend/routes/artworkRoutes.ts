import express from "express";

import { checkAuth } from "../middleware/checkAuth.js";
import { requireSuperUser } from "../middleware/requireSuperUser.js";
import { validateBody, validateParams } from "../middleware/validate.js";

import {
  showAllArtworks,
  showOneArtwork,
  showDeletedArtworks,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  restoreArtwork,
  setArtworkScreen,
  removeArtworkScreen,
} from "../controllers/artworkController";

import {
  artworkIdSchema,
  artworkLanguageSchema,
  artworkIdLanguageParamsSchema,
  createArtworkSchema,
  updateArtworkSchema,
} from "../schemas/artworkSchema.js";

const router = express.Router();

router.use(checkAuth);

// Alle gelöschten Artworks abrufen (nur für SuperAdmins)
router.get(
  "/deleted/:languageCode",
  requireSuperUser,
  validateParams(artworkLanguageSchema),
  showDeletedArtworks
);

// Alle Artworks abrufen
router.get(
  "/:languageCode",
  validateParams(artworkLanguageSchema),
  showAllArtworks
);

// Ein einzelnes Artwork laden
router.get(
  "/:artworkId/:languageCode",
  validateParams(artworkIdLanguageParamsSchema),
  showOneArtwork
);

// Ein neues Artwork erstellen
router.post("/", validateBody(createArtworkSchema), createArtwork);

// Ein Artwork löschen (Soft Delete)
router.patch(
  "/:artworkId/delete",
  requireSuperUser,
  validateParams(artworkIdSchema),
  deleteArtwork
);

// Einen Artwork wiederherstellen (geht nur für Super Admins)
router.patch(
  "/:artworkId/restore",
  requireSuperUser,
  validateParams(artworkIdSchema),
  restoreArtwork
);

// Ein Artwork aktualisieren / editieren
router.patch(
  "/:artworkId/:languageCode",
  validateParams(artworkIdLanguageParamsSchema),
  validateBody(updateArtworkSchema),
  updateArtwork
);

// Ein Artwork als Screen markieren
router.patch(
  "/:artworkId/:languageCode/screen",
  validateParams(artworkIdLanguageParamsSchema),
  setArtworkScreen
);

// Ein Artwork wieder als Screen entfernen
router.patch(
  "/:artworkId/:languageCode/unscreen",
  validateParams(artworkIdLanguageParamsSchema),
  removeArtworkScreen
);

export default router;
