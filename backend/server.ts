import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "./lib/db.js";
import "./models/associations.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import exhibitionRoutes from "./routes/exhibitionRoutes.js";
import exhibitionTranslationRoutes from "./routes/exhibitionTranslationRoutes.js";
import artworkRoutes from "./routes/artworkRoutes.js";
import artworkTranslationRoutes from "./routes/artworkTranslationRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import artistTranslationRoutes from "./routes/artistTranslationRoutes.js";
import metArtworkRoutes from "./routes/metArtworkRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN;

const app = express();

app.use(
  cors({
    origin: ORIGIN,
    credentials: true, // so werden Cookies wirklich mitgeschickt
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Route Prefix + Routes einbinden
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/exhibition", exhibitionRoutes);
app.use("/api/exhibitiontranslation", exhibitionTranslationRoutes);
app.use("/api/artwork", artworkRoutes);
app.use("/api/artworktranslation", artworkTranslationRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/artisttranslation", artistTranslationRoutes);
app.use("/api/metartwork", metArtworkRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/media", mediaRoutes);

async function startServer() {
  await db.authenticate(); // prüft die Verbindung von Sequelize zur DB
  console.log("Database connection has been established successfully.");

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
  });
}

startServer();
