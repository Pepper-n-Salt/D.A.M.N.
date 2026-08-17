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

router.use(checkAuth);

router.get(
  "/:languageCode",
  validateParams(artworkLanguageSchema),
  showAllArtworks
);

router.get(
  "/:artworkId/:languageCode",
  validateParams(artworkIdLanguageParamsSchema),
  showOneArtwork
);

router.post("/", validateBody(createArtworkSchema), createArtwork);

router.patch("/:artworkId", validateParams(artworkIdSchema), deleteArtwork);

router.patch(
  "/:artworkId/:languageCode",
  validateParams(artworkIdLanguageParamsSchema),
  validateBody(updateArtworkSchema),
  updateArtwork
);

export default router;
