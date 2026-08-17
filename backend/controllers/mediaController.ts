import type { Request, Response } from "express";
import cloudinary from "../lib/cloudinary.js";
import Media from "../models/Media.js";
import crypto from "node:crypto";

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
      // Du benutzt await new Promise wenn du eine Funktion hast, die keine Promises zurückgibt (also kein async/await unterstützt), sondern mit Callbacks arbeitet
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "upload-demo", // name des preset von cloudinary
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
    res
      .status(500)
      .send("Server-Fehler! Das Bild konnte nicht hochgeladen werden.");
  }
};
