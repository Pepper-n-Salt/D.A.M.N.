import db from "../lib/db.js";
import Artwork from "../models/Artwork.js";
import ArtworkTranslation from "../models/ArtworkTranslation.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    const translations = [
      {
        artworkId: "110e8400-e29b-41d4-a716-446655440001",
        languageCode: "de",
        title: "Landschaft im Abendlicht",
        subtitle: "Studie",
        country: "Deutschland",
        origin: "Leipzig",
        material: "Öl auf Leinwand",
        description:
          "Eine Landschaftsdarstellung mit warmen Farbtönen und einer ruhigen Abendstimmung.",
        aiGenerated: false,
        isScreen: false,
      },
      {
        artworkId: "110e8400-e29b-41d4-a716-446655440001",
        languageCode: "en",
        title: "Landscape in Evening Light",
        subtitle: "Study",
        country: "Germany",
        origin: "Leipzig",
        material: "Oil on canvas",
        description:
          "A landscape painting with warm colors and a calm evening atmosphere.",
        aiGenerated: false,
        isScreen: false,
      },

      {
        artworkId: "110e8400-e29b-41d4-a716-446655440002",
        languageCode: "de",
        title: "Stadtfragmente",
        subtitle: null,
        country: "Deutschland",
        origin: "Berlin",
        material: "Acryl auf Holz",
        description:
          "Abstrakte Komposition aus architektonischen Formen und urbanen Strukturen.",
        aiGenerated: false,
        isScreen: false,
      },
      {
        artworkId: "110e8400-e29b-41d4-a716-446655440002",
        languageCode: "en",
        title: "Urban Fragments",
        subtitle: null,
        country: "Germany",
        origin: "Berlin",
        material: "Acrylic on wood",
        description:
          "An abstract composition of architectural forms and urban structures.",
        aiGenerated: false,
        isScreen: false,
      },

      {
        artworkId: "110e8400-e29b-41d4-a716-446655440003",
        languageCode: "de",
        title: "Zwischen den Zeiten",
        subtitle: "Komposition III",
        country: "Österreich",
        origin: "Wien",
        material: "Mischtechnik auf Papier",
        description:
          "Eine experimentelle Arbeit über Erinnerung, Zeit und Veränderung.",
        aiGenerated: false,
        isScreen: false,
      },
      {
        artworkId: "110e8400-e29b-41d4-a716-446655440003",
        languageCode: "en",
        title: "Between the Times",
        subtitle: "Composition III",
        country: "Austria",
        origin: "Vienna",
        material: "Mixed media on paper",
        description: "An experimental work exploring memory, time, and change.",
        aiGenerated: false,
        isScreen: false,
      },
    ];

    for (const translationData of translations) {
      // Prüfen, ob das zugehörige Artwork existiert
      const artwork = await Artwork.findByPk(translationData.artworkId);

      if (!artwork) {
        throw new Error(
          `Artwork ${translationData.artworkId} wurde nicht gefunden. Bitte zuerst seedArtwork.ts ausführen.`
        );
      }

      const [translation, created] = await ArtworkTranslation.findOrCreate({
        where: {
          artworkId: translationData.artworkId,
          languageCode: translationData.languageCode,
        },
        defaults: translationData,
      });

      if (created) {
        console.log(
          `ArtworkTranslation "${translation.artworkId}" (${translation.languageCode}) angelegt.`
        );
      } else {
        console.log(
          `ArtworkTranslation "${translation.artworkId}" (${translation.languageCode}) existiert bereits, überspringe.`
        );
      }
    }

    console.log("ArtworkTranslation-Seed fertig.");
  } catch (error) {
    console.error("ArtworkTranslation-Seed-Fehler", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
