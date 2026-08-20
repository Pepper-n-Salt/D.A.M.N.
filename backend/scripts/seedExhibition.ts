import db from "../lib/db.js";
import Exhibition from "../models/Exhibition.js";
import User from "../models/User.js";
import Media from "../models/Media.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    // bestehenden Superadmin für createdBy suchen
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

    // Cover Image über ID suchen
    const media = await Media.findByPk("660e8400-e29b-41d4-a716-446655440000");

    if (!media) {
      throw new Error(
        "Cover Image wurde nicht gefunden. Bitte zuerst seedMedia.ts ausführen."
      );
    }

    const exhibitions = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        startDate: "2026-08-01",
        endDate: "2026-09-30",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        startDate: "2026-10-01",
        endDate: "2026-11-30",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        startDate: "2026-12-01",
        endDate: "2027-01-31",
      },
    ];

    for (const exhibitionData of exhibitions) {
      const [exhibition, created] = await Exhibition.findOrCreate({
        where: {
          id: exhibitionData.id,
        },
        defaults: {
          id: exhibitionData.id,
          coverImageId: media.id,
          startDate: exhibitionData.startDate,
          endDate: exhibitionData.endDate,
          createdBy: user.id,
          lastEditedBy: null,
          isArchived: false,
          isDeleted: false,
          primaryColor: "#000000",
          secondaryColor: "#ffffff",
          backgroundColor: "#ffffff",
          textColor: "#000000",
          headlineFont: null,
          textFont: null,
          roundness: "none",
        },
      });

      if (created) {
        console.log(`Exhibition "${exhibition.id}" angelegt.`);
      } else {
        console.log(
          `Exhibition "${exhibition.id}" existiert bereits, überspringe.`
        );
      }
    }
    console.log("Exhibition-Seed fertig.");
  } catch (e) {
    console.error("Exhibition-Seed-Fehler", e);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
