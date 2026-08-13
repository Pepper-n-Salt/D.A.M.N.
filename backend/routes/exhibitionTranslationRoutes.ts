import express from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import {
  createExhibitionTranslation,
  updateExhibitionTranslation,
} from "../controllers/exhibitionTranslationController.js";

const router = express.Router();

router.use(checkAuth);

router.post("/:exhibitionId/translations", createExhibitionTranslation);

router.patch(
  "/:exhibitionId/translations/:languageCode",
  updateExhibitionTranslation
);

export default router;
