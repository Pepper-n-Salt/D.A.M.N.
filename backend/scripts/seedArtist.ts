import db from "../lib/db.js";
import Artist from "../models/Artist.js";
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

    // Bestehendes Media-Objekt für die Artists suchen
    const media = await Media.findByPk("660e8400-e29b-41d4-a716-446655440000");

    if (!media) {
      throw new Error(
        "Media wurde nicht gefunden. Bitte zuerst seedMedia.ts ausführen."
      );
    }

    const artists = [
      {
        id: "220e8400-e29b-41d4-a716-446655440001",
        imageId: media.id,
        dateOfBirth: "1978-04-15",
        dateOfDeath: null,
      },
      {
        id: "220e8400-e29b-41d4-a716-446655440002",
        imageId: media.id,
        dateOfBirth: "1965-11-02",
        dateOfDeath: "2021-07-18",
      },
      {
        id: "220e8400-e29b-41d4-a716-446655440003",
        imageId: media.id,
        dateOfBirth: "1989-09-27",
        dateOfDeath: null,
      },
    ];

    for (const artistData of artists) {
      const [artist, created] = await Artist.findOrCreate({
        where: {
          id: artistData.id,
        },
        defaults: {
          id: artistData.id,
          imageId: artistData.imageId,
          dateOfBirth: artistData.dateOfBirth,
          dateOfDeath: artistData.dateOfDeath,
          createdBy: user.id,
          lastEditedBy: null,
          isDeleted: false,
        },
      });

      if (created) {
        console.log(`Artist "${artist.id}" angelegt.`);
      } else {
        console.log(`Artist "${artist.id}" existiert bereits, überspringe.`);
      }
    }

    console.log("Artist-Seed fertig.");
  } catch (error) {
    console.error("Artist-Seed-Fehler", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
