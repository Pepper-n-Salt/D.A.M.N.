import db from "../lib/db.js";
import Exhibition from "../models/Exhibition.js";
import ExhibitionTranslation from "../models/ExhibitionTranslation.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    const translations = [
      {
        exhibitionId: "550e8400-e29b-41d4-a716-446655440001",
        languageCode: "de",
        title: "Licht und Raum",
        subtitle: "Eine Ausstellung über die Wirkung von Licht",
        location: "Museum der Zukunft, Leipzig",
        description:
          "Diese Ausstellung beschäftigt sich mit dem Zusammenspiel von Licht, Raum und Architektur.",
        openingEvent: "Eröffnung am 1. August 2026",
        specialEvent: "Nacht der Museen",
        closingEvent: "Finissage am 30. September 2026",
      },
      {
        exhibitionId: "550e8400-e29b-41d4-a716-446655440002",
        languageCode: "de",
        title: "Form und Bewegung",
        subtitle: "Kunst zwischen Statik und Dynamik",
        location: "Galerie am Park, Leipzig",
        description:
          "Die Ausstellung zeigt Werke, die sich mit Bewegung, Körper und räumlicher Wahrnehmung auseinandersetzen.",
        openingEvent: "Eröffnung am 1. Oktober 2026",
        specialEvent: "Künstler:innengespräch am 15. Oktober 2026",
        closingEvent: "Finissage am 30. November 2026",
      },
      {
        exhibitionId: "550e8400-e29b-41d4-a716-446655440003",
        languageCode: "de",
        title: "Zwischen Welten",
        subtitle: "Zeitgenössische Perspektiven auf Identität und Gesellschaft",
        location: "Kunsthalle Leipzig",
        description:
          "Diese Ausstellung versammelt zeitgenössische Positionen, die sich mit Identität, Zugehörigkeit und gesellschaftlichem Wandel beschäftigen.",
        openingEvent: "Eröffnung am 1. Dezember 2026",
        specialEvent: "Podiumsdiskussion am 12. Dezember 2026",
        closingEvent: "Finissage am 31. Januar 2027",
      },
    ];

    for (const translationData of translations) {
      // Prüfen, ob die zugehörige Exhibition existiert.
      const exhibition = await Exhibition.findByPk(
        translationData.exhibitionId
      );

      if (!exhibition) {
        throw new Error(
          `Exhibition ${translationData.exhibitionId} wurde nicht gefunden. Bitte zuerst seedExhibition.ts ausführen.`
        );
      }

      const [translation, created] = await ExhibitionTranslation.findOrCreate({
        where: {
          exhibitionId: translationData.exhibitionId,
          languageCode: translationData.languageCode,
        },
        defaults: {
          exhibitionId: translationData.exhibitionId,
          languageCode: translationData.languageCode,
          title: translationData.title,
          subtitle: translationData.subtitle,
          location: translationData.location,
          description: translationData.description,
          openingEvent: translationData.openingEvent,
          specialEvent: translationData.specialEvent,
          closingEvent: translationData.closingEvent,
          aiGenerated: false,
          isScreen: false,
        },
      });

      if (created) {
        console.log(
          `Translation "${translation.languageCode}" für Exhibition "${translation.exhibitionId}" angelegt.`
        );
      } else {
        console.log(
          `Translation "${translation.languageCode}" für Exhibition "${translation.exhibitionId}" existiert bereits, überspringe.`
        );
      }
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
