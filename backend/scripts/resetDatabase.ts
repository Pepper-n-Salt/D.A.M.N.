import db from "../lib/db.js";
import "../models/associations.js";

const run = async () => {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Der Datenbank-Reset ist in Produktion deaktiviert.");
    }

    await db.authenticate();
    console.log("DB verbunden.");

    await db.sync({ force: true });
    console.log("Datenbank wurde aus den Sequelize-Models neu erstellt.");
  } catch (error) {
    console.error("Datenbank-Reset fehlgeschlagen.", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
