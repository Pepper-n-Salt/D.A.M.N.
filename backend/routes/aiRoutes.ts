import express from "express";
// an dieser Stelle noch middleWare checkAuth importieren
import { translateWithAI } from "../controllers/aiController";

const router = express.Router();

router.post("/translate", () => {}, translateWithAI);

export default router;
