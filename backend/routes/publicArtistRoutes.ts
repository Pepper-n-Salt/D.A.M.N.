import express from "express";

import { showPublicArtist } from "../controllers/artistController.js";

import { validateParams } from "../middleware/validate.js";

import { artistIdLanguageParamsSchema } from "../schemas/artistSchema.js";

const router = express.Router();

router.get(
  "/public/:artistId/:languageCode",
  validateParams(artistIdLanguageParamsSchema),
  showPublicArtist
);

export default router;
