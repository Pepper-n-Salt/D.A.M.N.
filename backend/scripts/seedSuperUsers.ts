import crypto from "node:crypto";
import bcrypt from "bcrypt";
import db from "../lib/db.js";
import User from "../models/User.js";
import Organisation from "../models/Organisation.js";
import Media from "../models/Media.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    // zuerst brauchen wir Media (Logo), Organisation und User, weil User von beiden (indirekt) abhängt

    // await Media.sync();
    await Organisation.sync();
    await User.sync();
    console.log(
      "Media-, Organisation- und User-Tabellen kontrolliert / erstellt."
    );

    // findOrCreate gibt ein Array zurück
    // const [logo] = await Media.findOrCreate({
    //   where: { fileUrl: "https://example.com/super-organisation-logo.png" },
    //   defaults: {
    //     id: crypto.randomUUID(),
    //     fileName: "super-organisation-logo.png",
    //     mimeType: "image/png",
    //   },
    // });

    const [organisation] = await Organisation.findOrCreate({
      where: { name: "Salt and Pepper" },
      defaults: {
        id: crypto.randomUUID(),
        // logoId: logo.id,
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

    // const allUsers = await User.findAll({
    //   attributes: [
    //     "id",
    //     "firstName",
    //     "lastName",
    //     "email",
    //     "role",
    //     "organisationId",
    //   ],
    // });

    // console.table(allUsers);

    console.log("Seed fertig.");
    process.exit(0);
  } catch (error) {
    console.error("Seed-Fehler", error);
    process.exit(1);
  }
};

run();
