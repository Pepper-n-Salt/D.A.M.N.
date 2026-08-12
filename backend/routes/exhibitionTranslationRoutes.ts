import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  createExhibitionTranslation,
  updateExhibitionTranslation,
} from "../controllers/exhibitionTranslationController.js";

const router = express.Router();

router.post(
  "/:exhibitionId/translations",
  checkAuth,
  createExhibitionTranslation
);

router.patch(
  "/:exhibitionId/translations/:languageCode",
  checkAuth,
  updateExhibitionTranslation
);

export default router;
