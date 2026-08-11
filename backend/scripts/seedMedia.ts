import db from "../lib/db.js";
import Media from "../models/Media.js";

const run = async () => {
  try {
    await db.authenticate();
    console.log("DB verbunden.");

    const mediaId = "660e8400-e29b-41d4-a716-446655440000";

    const [media, created] = await Media.findOrCreate({
      where: {
        id: mediaId,
      },
      defaults: {
        id: mediaId,
        fileName: "exhibition-cover.jpg",
        mimeType: "image/jpeg",
        fileUrl: "https://example.com/images/exhibition-cover.jpg",
      },
    });

    if (created) {
      console.log(`Media "${media.fileName}" angelegt.`);
    } else {
      console.log(`Media "${media.fileName}" existiert bereits, überspringe.`);
    }

    console.log("Media-Seed fertig.");
  } catch (error) {
    console.error("Media-Seed-Fehler", error);
    process.exitCode = 1;
  } finally {
    await db.close();
  }
};

await run();
