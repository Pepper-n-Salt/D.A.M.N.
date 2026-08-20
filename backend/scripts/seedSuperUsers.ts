import crypto from "node:crypto";
import bcrypt from "bcrypt";
import db from "../lib/db.js";
import User from "../models/User.js";
import Organisation from "../models/Organisation.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    const [organisation] = await Organisation.findOrCreate({
      where: { name: "Salt and Pepper" },
      defaults: {
        id: crypto.randomUUID(),
      },
    });

    const users = [
      {
        id: crypto.randomUUID(),
        firstName: "Imke",
        lastName: "Super",
        email: "imke@super.example",
        password: "ImkeSuper123!",
        role: "super",
      },
      {
        id: crypto.randomUUID(),
        firstName: "Mela",
        lastName: "Super",
        email: "mela@super.example",
        password: "MelaSuper123!",
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
        organisationId: organisation.id,
        password: hashedPassword,
      });

      console.log(`Super-User ${userData.email} angelegt.`);
    }

    console.log("Seed fertig.");
  } catch (error) {
    console.error("Seed-Fehler", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
