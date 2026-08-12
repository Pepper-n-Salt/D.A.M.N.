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
  createArtworkSchema,
  updateArtworkSchema,
} from "../schemas/artworkSchema.js";

const router = express.Router();

router.get("/", checkAuth, showAllArtworks);

router.get(
  "/:artworkId",
  checkAuth,
  validateParams(artworkIdSchema),
  showOneArtwork
);

router.post("/", checkAuth, validateBody(createArtworkSchema), createArtwork);

router.patch(
  "/:artworkId",
  checkAuth,
  validateParams(artworkIdSchema),
  validateBody(updateArtworkSchema),
  updateArtwork
);

router.patch(
  "/:artworkId",
  checkAuth,
  validateParams(artworkIdSchema),
  deleteArtwork
);

export default router;
