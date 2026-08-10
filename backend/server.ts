import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "./lib/db.js";
import "./models/associations.js";

// hier später Routes importieren
import authRouter from "./routes/authRoutes.ts";
import userRouter from "./routes/userRoutes.ts";
import historyRouter from "./routes/historyRoutes.ts";
import exhibitionRouter from "./routes/exhibitionRoutes.ts";
import artworkRouter from "./routes/artworkRoutes.ts";
import artistRouter from "./routes/artistRoutes.ts";
import metArtworkRouter from "./routes/metArtworkRoutes.ts";
import aiRouter from "./routes/aiRoutes.ts";
import contactRouter from "./routes/contactRoutes.ts";

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
app.use("/api/artwork", artworkRouter);
app.use("/api/artist", artistRouter);
app.use("/api/metartwork", metArtworkRouter);
app.use("/api/ai", aiRouter);
app.use("/api/contact", contactRouter);

await db.sync({ force: true }); // hier hinterher alter reinsetzen // würde Sequelize-Models mit der DB vergleichen und Tabellen anpassen

async function startServer() {
  await db.authenticate(); // prüft die Verbindung von Sequelize zur DB
  console.log("Database connection has been established successfully.");

  app.listen(PORT, () => {
    console.log(`Server hört auf Port ${PORT}.`);
  });
}

startServer();
