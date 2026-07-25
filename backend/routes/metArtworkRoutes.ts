import express from "express";
// hier middleware checkAuth importieren
import { getMetArtwork } from "../controllers/metArtworkController";

const router = express.Router();

router.get("/:metArtworkId", () => {}, getMetArtwork);

export default router;
