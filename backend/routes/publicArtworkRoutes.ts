import express from "express";

import { showPublicArtwork } from "../controllers/artworkController.js";

import { validateParams } from "../middleware/validate.js";

import { artworkIdLanguageParamsSchema } from "../schemas/artworkSchema.js";

const router = express.Router();

router.get(
  "/public/:artworkId/:languageCode",
  validateParams(artworkIdLanguageParamsSchema),
  showPublicArtwork
);

export default router;
