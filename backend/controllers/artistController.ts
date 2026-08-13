import type { Request, Response } from "express";
import { Artist, ArtistTranslation } from "../models";
import db from "../lib/db";

// Alle Artists abrufen
// Wird z. B. für das Select-/Suchfeld im Artwork-Formular verwendet
// getestet: noch nicht
export const showAllArtists = async (req: Request, res: Response) => {
  try {
    const artists = await Artist.findAll({ where: { isDeleted: false } });

    return res.status(200).json(artists);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

// Einzelnen nicht gelöschten Artist abrufen
// getestet: noch nicht
export const showOneArtist = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

// Neuen Artist als kompletten Datensatz, also inklusive der ersten "Translation", anlegen
export const createArtist = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

// Artist und die dazugehörige Übersetzung aktualisieren
export const updateArtist = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

// Artist per Soft Delete als gelöscht markieren
export const deleteArtist = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
