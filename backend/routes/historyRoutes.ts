import express from "express";
// hier middleware checkAuth importieren
import { getLatestEntries } from "../controllers/historyController";

const router = express.Router();

router.get("/entries", () => {}, getLatestEntries);

export default router;
