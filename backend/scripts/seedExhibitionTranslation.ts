import db from "../lib/db.js";
import Exhibition from "../models/Exhibition.js";
import ExhibitionTranslation from "../models/ExhibitionTranslation.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    const exhibitionId = "550e8400-e29b-41d4-a716-446655440000";

    // überpürfen, ob die Exhibition existiert
    const exhibition = await Exhibition.findByPk(exhibitionId);

    if (!exhibition) {
      throw new Error(
        `Exhibition ${exhibitionId} wurde nicht gefunden. Bitte zuerst seedExhibition.ts ausführen.`
      );
    }

    const [translation, created] = await ExhibitionTranslation.findOrCreate({
      where: {
        exhibitionId,
        languageCode: "de",
      },
      defaults: {
        exhibitionId,
        languageCode: "de",
        title: "Licht und Raum",
        subtitle: "Eine Ausstellung über die Wirkung von Licht",
        location: "Museum der Zukunft, Leipzig",
        description:
          "Diese Ausstellung beschäftigt sich mit dem Zusammenspiel von Licht, Raum und Architektur.",
        openingEvent: "Eröffnung am 1. August 2026",
        specialEvent: "Nacht der Museen",
        closingEvent: "Finissage am 30. September 2026",
        aiGenerated: false,
        isScreen: false,
      },
    });

    if (created) {
      console.log(`Translation "${translation.languageCode}" angelegt.`);
    } else {
      console.log(
        `Translation "${translation.languageCode}" existiert bereits, überspringe.`
      );
    }

    console.log("Exhibition-Translation-Seed fertig.");
  } catch (error) {
    console.error("Exhibition-Translation-Seed-Fehler", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
