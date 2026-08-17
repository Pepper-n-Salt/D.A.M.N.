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
        mimeType: "image/jpeg",
        fileUrl:
          "https://res.cloudinary.com/dein-cloud-name/image/upload/v1234567890/upload-demo/exhibition-cover.jpg",
        publicId: "exhibition-cover",
      },
    });

    if (created) {
      console.log(`Media "${media.id}" angelegt.`);
    } else {
      console.log(`Media "${media.id}" existiert bereits, überspringe.`);
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
