import db from "../lib/db.js";
import Artwork from "../models/Artwork.js";
import User from "../models/User.js";
import Media from "../models/Media.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    // Bestehenden Superadmin für createdBy suchen
    const user = await User.findOne({
      where: {
        email: "imke@super.example",
      },
    });

    if (!user) {
      throw new Error(
        "User imke@super.example wurde nicht gefunden. Bitte zuerst seedSuperUsers.ts ausführen."
      );
    }

    // Bestehendes Media-Objekt für die Artworks suchen
    const media = await Media.findByPk("660e8400-e29b-41d4-a716-446655440000");

    if (!media) {
      throw new Error(
        "Media wurde nicht gefunden. Bitte zuerst seedMedia.ts ausführen."
      );
    }

    const artworks = [
      {
        id: "110e8400-e29b-41d4-a716-446655440001",
        year: 2024,
        dimensions: "80 × 60 cm",
        imageId: media.id,
      },
      {
        id: "110e8400-e29b-41d4-a716-446655440002",
        year: 2023,
        dimensions: "120 × 90 cm",
        imageId: media.id,
      },
      {
        id: "110e8400-e29b-41d4-a716-446655440003",
        year: 2025,
        dimensions: "50 × 70 cm",
        imageId: media.id,
      },
    ];

    for (const artworkData of artworks) {
      const [artwork, created] = await Artwork.findOrCreate({
        where: {
          id: artworkData.id,
        },
        defaults: {
          id: artworkData.id,
          year: artworkData.year,
          dimensions: artworkData.dimensions,
          imageId: artworkData.imageId,
          createdBy: user.id,
          lastEditedBy: null,
          isDeleted: false,
        },
      });

      if (created) {
        console.log(`Artwork "${artwork.id}" angelegt.`);
      } else {
        console.log(`Artwork "${artwork.id}" existiert bereits, überspringe.`);
      }
    }

    console.log("Artwork-Seed fertig.");
  } catch (error) {
    console.error("Artwork-Seed-Fehler", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
