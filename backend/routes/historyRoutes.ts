import express from "express";
// hier middleware checkAuth importieren
// hier controller importieren

const router = express.Router();

router.get("/entries", () => {}, getLatestEntries);

export default router;
