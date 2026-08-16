import type { Request, Response } from "express";
import db from "../lib/db";
import { Artwork, ArtworkTranslation } from "../models";

export const createArtworkTranslation = async (
  req: Request<{ artworkId: string }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { artworkId } = req.params;

    const {
      languageCode,
      title,
      subtitle,
      country,
      origin,
      material,
      description,
    } = req.body;

    // überprüfen, dass das Artwork existiert und nicht gelöscht wurde
    const artwork = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: false,
      },
      transaction: t,
    });

    if (!artwork) {
      await t.rollback();

      return res.status(404).json({
        msg: "Das Artwork wurde nicht gefunden.",
      });
    }

    // überprüfen, ob diese Sprache bereits existiert
    const existingTranslation = await ArtworkTranslation.findOne({
      where: {
        artworkId,
        languageCode,
      },
      transaction: t,
    });

    if (existingTranslation) {
      await t.rollback();

      return res.status(400).json({
        msg: "Für dieses Artwork existiert bereits eine Übersetzung in dieser Sprache.",
      });
    }

    const translation = await ArtworkTranslation.create(
      {
        artworkId,
        languageCode,
        title,
        subtitle,
        country,
        origin,
        material,
        description,
        aiGenerated: false,
        isScreen: false,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      artworkId: translation.artworkId,
      languageCode: translation.languageCode,
      title: translation.title,
      subtitle: translation.subtitle,
      country: translation.country,
      origin: translation.origin,
      material: translation.material,
      description: translation.description,
      // aiGenerated: translation.aiGenerated,
      isScreen: translation.isScreen,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die ArtworkTranslation konnte nicht angelegt werden.",
    });
  }
};

export const updateArtworkTranslation = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
