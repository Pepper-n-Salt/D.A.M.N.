import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "./lib/db.js";
import "./models/associations.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import historyRouter from "./routes/historyRoutes.js";
import exhibitionRouter from "./routes/exhibitionRoutes.js";
import exhibitionTranslationRouter from "./routes/exhibitionTranslationRoutes.js";
import artworkRouter from "./routes/artworkRoutes.js";
import artworkTranslationRouter from "./routes/artworkTranslationRoutes.js";
import artistRouter from "./routes/artistRoutes.js";
import artistTranslationRouter from "./routes/artistTranslationRoutes.js";
import metArtworkRouter from "./routes/metArtworkRoutes.js";
import aiRouter from "./routes/aiRoutes.js";
import contactRouter from "./routes/contactRoutes.js";

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.ORIGIN;

const app = express();

// console.log({ ORIGIN });

app.use(
  cors({
    origin: ORIGIN,
    credentials: true, // so werden Cookies wirklich mitgeschickt
  })
);

app.use(express.json());
app.use(cookieParser());

// Route Prefix + Routes einbinden
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/history", historyRouter);
app.use("/api/exhibition", exhibitionRouter);
app.use("/api/exhibitiontranslation", exhibitionTranslationRouter);
app.use("/api/artwork", artworkRouter);
app.use("/api/artworktranslation", artworkTranslationRouter);
app.use("/api/artist", artistRouter);
app.use("/api/artisttranslation", artistTranslationRouter);
app.use("/api/metartwork", metArtworkRouter);
app.use("/api/ai", aiRouter);
app.use("/api/contact", contactRouter);

async function startServer() {
  await db.authenticate(); // prüft die Verbindung von Sequelize zur DB
  console.log("Database connection has been established successfully.");

  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}.`);
  });
}

startServer();
