import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "node:http";

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
import aiRoutes from "./routes/aiRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import publicExhibitionRoutes from "./routes/publicExhibitionRoutes.js";
import publicArtworkRoutes from "./routes/publicArtworkRoutes.js";
import publicArtistRoutes from "./routes/publicArtistRoutes.js";

import { setupChatWebSocket } from "./websocket/chatServer.js";

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN;

const app = express();

app.use(
  cors({
    origin: ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/history", historyRoutes);

app.use("/api/exhibition", publicExhibitionRoutes);
app.use("/api/exhibition", exhibitionRoutes);
app.use("/api/exhibitiontranslation", exhibitionTranslationRoutes);

app.use("/api/artwork", publicArtworkRoutes);
app.use("/api/artwork", artworkRoutes);
app.use("/api/artworktranslation", artworkTranslationRoutes);

app.use("/api/artist", publicArtistRoutes);
app.use("/api/artist", artistRoutes);
app.use("/api/artisttranslation", artistTranslationRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/media", mediaRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "Der angeforderte Endpunkt existiert nicht.",
  });
});

async function startServer() {
  await db.authenticate();

  console.log("Database connection has been established successfully.");

  const server = createServer(app);

  setupChatWebSocket(server);

  server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
  });
}

startServer();
