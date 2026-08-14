import type { Request, Response } from "express";
import multer from "multer"; // middleware für dateiupload in express
import cloudinary from "../lib/cloudinary.js";
import https from "https"; // bringt node schon mit

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    const name = Date.now();

    // Multer hängt das Bild unter req.file ein
    if (!req.file) {
      return res.status(400).json({ msg: "No image uploaded!" });
    }
  } catch (e) {}
};
