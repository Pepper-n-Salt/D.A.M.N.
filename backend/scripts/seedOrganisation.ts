import db from "../lib/db.js";
import Organisation from "../models/Organisation.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    const organisationId = "10000000-0000-4000-8000-000000000001";

    const [organisation, created] = await Organisation.findOrCreate({
      where: {
        id: organisationId,
      },
      defaults: {
        id: organisationId,
        name: "Salt'n'Pepper",
        logoId: null,
      },
    });

    if (created) {
      console.log(`Organisation "${organisation.name}" angelegt.`);
    } else {
      console.log(
        `Organisation "${organisation.name}" existiert bereits, überspringe.`
      );
    }

    console.log("Organisation-Seed fertig.");
  } catch (e) {
    console.error("Organisation-Seed-Fehler", e);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
