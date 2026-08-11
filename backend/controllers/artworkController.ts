import type { Request, Response } from "express";
import { Artwork, ArtworkTranslation } from "../models";
import db from "../lib/db";

// Alle Artworks abrufen
export const showAllArtworks = async (req: Request, res: Response) => {
  try {
    const artworks = await Artwork.findAll({ where: { isDeleted: false } });

    return res.status(200).json(artworks);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// Einzelnes Artwork abrufen
export const showOneArtwork = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const createArtwork = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const updateArtwork = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const deleteArtwork = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
