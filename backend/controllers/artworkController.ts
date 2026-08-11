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

// Neues Artwork inklusive der ersten Übersetzung anlegen
export const createArtwork = async (req: Request, res: Response) => {
  const t = await db.transaction();

  try {
    // im FE ist noch "country" mit drin und auch "artist" als select. "country" nicht mit in models drin. Nochmal abgleichen!
    const {
      year,
      dimensions,
      imageId,
      languageCode,
      title,
      subtitle,
      origin,
      material,
      description,
    } = req.body;

    const artwork = await Artwork.create(
      {
        id: crypto.randomUUID(),
        year,
        dimensions,
        imageId,
        createdBy: req.user!.id,
        lastEditedBy: req.user!.id,
        isDeleted: false,
      },
      { transaction: t }
    );

    // noch füllen
    const artworkTranslation = await ArtworkTranslation.create(
      {
        artworkId: artwork.id,
        languageCode,
        title,
        subtitle,
        origin,
        material,
        description,
        aiGenerated: false, // oder sollte hier true rein?
        isScreen: false,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({ artwork, artworkTranslation });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

export const updateArtwork = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const deleteArtwork = async (req: Request, res: Response) => {
  try {
    const { artworkId } = req.params;

    const artwork = await Artwork.findOne({
      where: { id: artworkId, isDeleted: false },
    });

    if (!artwork) {
      return res.status(404).json({
        msg: "Das Artwork konnte nicht gefunden werden.",
      });
    }

    await artwork.update({ isDeleted: true, lastEditedBy: req.user!.id });

    return res.status(200).json(artwork);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Das Artwork konnte nicht als gelöscht markiert werden.",
    });
  }
};
