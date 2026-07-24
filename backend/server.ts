import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import db from "./lib/db.js";
import "./models/associations.js";

// hier späternRoutes importieren

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
app.use("/api/auth", () => {});
app.use("/api/user", () => {});
app.use("/api/exhibition", () => {});
app.use("/api/artwork", () => {});
app.use("/api/artist", () => {});

// await db.sync({ force: true }); // hier hinterher alter reinsetzen // würde Sequelize-Models mot der DB vergleichen und Tabellen anpassen

async function startServer() {
  await db.authenticate(); // prüft die Verbindung von Sequelize zur DB
  console.log("Datenbank verbunden.");

  app.listen(PORT, () => {
    console.log(`Server hört auf Port ${PORT}.`);
  });
}

startServer();
