import crypto from "node:crypto";
import bcrypt from "bcrypt";
import db from "../lib/db.js";
import User from "../models/User.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    await User.sync();
    console.log("User-Tabelle kontrolliert / erstellt.");

    const users = [
      {
        id: crypto.randomUUID(),
        firstName: "Imke",
        lastName: "Super",
        email: "imke@super.example",
        password: "ImkeSuper123!",
        organisationId: crypto.randomUUID(),
        role: "super",
      },
      {
        id: crypto.randomUUID(),
        firstName: "Mela",
        lastName: "Super",
        email: "mela@super.example",
        password: "MelaSuper123!",
        organisationId: crypto.randomUUID(),
        role: "super",
      },
    ];

    for (const userData of users) {
      const existing = await User.findOne({ where: { email: userData.email } });

      if (existing) {
        console.log(`User ${userData.email} existiert bereits, überspringe.`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      await User.create({
        ...userData,
        password: hashedPassword,
      });

      console.log(`Super-User ${userData.email} angelegt.`);
    }

    console.log("Seed fertig.");
    process.exit(0);
  } catch (error) {
    console.error("Seed-Fehler", error);
    process.exit(1);
  }
};

run();
