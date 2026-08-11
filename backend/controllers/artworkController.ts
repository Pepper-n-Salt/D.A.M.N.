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
export const showOneArtwork = async (
  req: Request<{ artworkId: string }>,
  res: Response
) => {
  try {
    const { artworkId } = req.params;

    const singleArtwork = Artwork.findByPk(artworkId);

    if (!singleArtwork) {
      return res.status(404).json({ msg: "Artwork wurde nicht gefunden." });
    }
    return res.status(200).json(singleArtwork);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler." });
  }
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
