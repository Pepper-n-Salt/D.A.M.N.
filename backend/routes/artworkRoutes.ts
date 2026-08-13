import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  showAllArtworks,
  showOneArtwork,
  createArtwork,
  updateArtwork,
  deleteArtwork,
} from "../controllers/artworkController";
import { validateBody, validateParams } from "../middleware/validate.js";
import {
  artworkIdSchema,
  artworkLanguageSchema,
  artworkIdLanguageParamsSchema,
  createArtworkSchema,
  updateArtworkSchema,
} from "../schemas/artworkSchema.js";

const router = express.Router();

router.get(
  "/:languageCode",
  checkAuth,
  validateParams(artworkLanguageSchema),
  showAllArtworks
);

router.get(
  "/:artworkId/:languageCode",
  checkAuth,
  validateParams(artworkIdLanguageParamsSchema),
  showOneArtwork
);

router.post("/", checkAuth, validateBody(createArtworkSchema), createArtwork);

router.patch(
  "/:artworkId",
  checkAuth,
  validateParams(artworkIdSchema),
  deleteArtwork
);

router.patch(
  "/:artworkId/:languageCode",
  checkAuth,
  validateParams(artworkIdLanguageParamsSchema),
  validateBody(updateArtworkSchema),
  updateArtwork
);

export default router;
