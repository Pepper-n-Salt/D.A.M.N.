import type { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
import Media from "../models/Media.js";
import crypto from "node:crypto";

// Bilder hochladen
// getestet: klappt!
export const uploadMedia = async (req: Request, res: Response) => {
  try {
    // Multer hängt das Bild unter req.file ein // daher prüfen, ob eine datei hochgeladen wurde
    if (!req.file) {
      return res.status(400).json({ msg: "Kein Bild hochgeladen!" });
    }

    // eindeutige ID für Cloudinary createn
    const publicId = `media_${crypto.randomUUID()}`;

    // bild zu cloudinary hochladen // das hier sind festlegungen von cloudinary, also: wo soll es bei cloudinary ankommen und welche dateiformate sind überhaupt erlaubt
    const uploadedImage = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "upload-damn", // name des preset von cloudinary
          public_id: publicId,
          allowed_formats: ["jpg", "png", "jpeg", "gif", "svg", "webp"],
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result); // hier steckt alles von Cloudinary drin, also im resultObjekt
        }
      );

      // req.file.buffer enthält die hochgeladene Datei als Binärdaten
      // Schickt den Inhalt des Buffers an cloudinary und schließt den Stream
      uploadStream.end(req.file?.buffer);
    });

    const media = await Media.create({
      id: crypto.randomUUID(),
      mimeType: req.file.mimetype,
      fileUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });

    return res.status(201).json({
      id: media.id,
      mimeType: media.mimeType,
      fileUrl: media.fileUrl,
      publicId: media.publicId,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send("Das Bild konnte nicht hochgeladen werden.");
  }
};

// Bild beim Editieren eines Formulars wieder anzeigen
// muss noch getestet werden (stand: 17.08.)
export const getMedia = async (
  req: Request<{ mediaId: string }>,
  res: Response
) => {
  try {
    const { mediaId } = req.params;

    if (!mediaId) {
      return res
        .status(400)
        .json({ msg: "Es wurde keine Media-ID angegeben." });
    }

    const media = await Media.findByPk(mediaId);

    if (!media) {
      return res.status(404).json({ msg: "Das Bild wurde nicht gefunden." });
    }

    return res.status(200).json({
      id: media.id,
      mimeType: media.mimeType,
      fileUrl: media.fileUrl,
      publicId: media.publicId,
    });
  } catch (e) {
    console.error(e);

    return res
      .status(500)
      .json({ msg: "Das Bild konnte nicht geladen werden." });
  }
};

// Bild löschen
// muss noch getestet werden (stand: 17.08.)
export const deleteMedia = async (
  req: Request<{ mediaId: string }>,
  res: Response
) => {
  try {
    const { mediaId } = req.params;

    if (!mediaId) {
      return res
        .status(400)
        .json({ msg: "Es wurde keine Media-ID angegeben." });
    }

    const media = await Media.findByPk(mediaId);

    if (!media) {
      return res.status(404).json({ msg: "Das Bild wurde nicht gefunden." });
    }

    // Bild bei Cloudinary löschen
    await cloudinary.uploader.destroy(media.publicId);

    // Bild aus unserer Datenbank löschen
    await media.destroy();

    return res.status(200).json({
      msg: "Media erfolgreich gelöscht.",
    });
  } catch (e) {
    console.error(e);

    return res
      .status(500)
      .json({ msg: "Das Bild konnte nicht gelöscht werden." });
  }
};
