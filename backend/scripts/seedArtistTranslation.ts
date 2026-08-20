import db from "../lib/db.js";
import Artist from "../models/Artist.js";
import ArtistTranslation from "../models/ArtistTranslation.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    const translations = [
      {
        artistId: "220e8400-e29b-41d4-a716-446655440001",
        languageCode: "de",
        firstName: "Anna",
        lastName: "Bergmann",
        country: "Deutschland",
        description:
          "Zeitgenössische Künstlerin mit Schwerpunkt auf abstrakter Malerei und räumlichen Kompositionen.",
        aiGenerated: false,
        isScreen: false,
      },
      {
        artistId: "220e8400-e29b-41d4-a716-446655440001",
        languageCode: "en",
        firstName: "Anna",
        lastName: "Bergmann",
        country: "Germany",
        description:
          "Contemporary artist focusing on abstract painting and spatial compositions.",
        aiGenerated: false,
        isScreen: false,
      },

      {
        artistId: "220e8400-e29b-41d4-a716-446655440002",
        languageCode: "de",
        firstName: "Thomas",
        lastName: "Keller",
        country: "Österreich",
        description:
          "Österreichischer Künstler, dessen Arbeiten sich mit Erinnerung, Zeit und urbanen Räumen beschäftigen.",
        aiGenerated: false,
        isScreen: false,
      },
      {
        artistId: "220e8400-e29b-41d4-a716-446655440002",
        languageCode: "en",
        firstName: "Thomas",
        lastName: "Keller",
        country: "Austria",
        description:
          "Austrian artist whose work explores memory, time, and urban spaces.",
        aiGenerated: false,
        isScreen: false,
      },

      {
        artistId: "220e8400-e29b-41d4-a716-446655440003",
        languageCode: "de",
        firstName: "Mira",
        lastName: "Hoffmann",
        country: "Deutschland",
        description:
          "Künstlerin aus Leipzig mit einem Schwerpunkt auf experimenteller Mixed-Media-Kunst.",
        aiGenerated: false,
        isScreen: false,
      },
      {
        artistId: "220e8400-e29b-41d4-a716-446655440003",
        languageCode: "en",
        firstName: "Mira",
        lastName: "Hoffmann",
        country: "Germany",
        description:
          "Leipzig-based artist focusing on experimental mixed-media works.",
        aiGenerated: false,
        isScreen: false,
      },
    ];

    for (const translationData of translations) {
      // Prüfen, ob der zugehörige Artist existiert
      const artist = await Artist.findByPk(translationData.artistId);

      if (!artist) {
        throw new Error(
          `Artist ${translationData.artistId} wurde nicht gefunden. Bitte zuerst seedArtist.ts ausführen.`
        );
      }

      const [translation, created] = await ArtistTranslation.findOrCreate({
        where: {
          artistId: translationData.artistId,
          languageCode: translationData.languageCode,
        },
        defaults: translationData,
      });

      if (created) {
        console.log(
          `ArtistTranslation "${translation.artistId}" (${translation.languageCode}) angelegt.`
        );
      } else {
        console.log(
          `ArtistTranslation "${translation.artistId}" (${translation.languageCode}) existiert bereits, überspringe.`
        );
      }
    }

    console.log("ArtistTranslation-Seed fertig.");
  } catch (error) {
    console.error("ArtistTranslation-Seed-Fehler", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
