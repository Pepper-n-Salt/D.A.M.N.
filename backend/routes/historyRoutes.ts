import express from "express";
// hier middleware checkAuth importieren
import { getLatestEntries } from "../controllers/historyController";

const router = express.Router();

router.get("/", () => {}, getLatestEntries); // evtl. Route wieder als "/entries" benennen, falls noch weitere dazu kommen

export default router;
