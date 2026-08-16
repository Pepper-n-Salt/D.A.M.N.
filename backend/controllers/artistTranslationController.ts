import type { Request, Response } from "express";
import db from "../lib/db.js";
import { Artist, ArtistTranslation } from "../models";

export const createArtistTranslation = async (
  req: Request<{ artistId: string }>,
  res: Response
) => {
  const t = await db.transaction();
  try {
    const { artistId } = req.params;

    const { languageCode, firstName, lastName, description, country } =
      req.body;

    // überprüfen, dass die:der Artist existiert und nicht gelöscht wurde
    const artist = await Artist.findOne({
      where: {
        id: artistId,
        isDeleted: false,
      },
      transaction: t,
    });

    if (!artist) {
      await t.rollback();

      return res.status(404).json({
        msg: "Der Artist wurde nicht gefunden.",
      });
    }

    // überprüfen, ob diese Sprache bereits existiert
    const existingTranslation = await ArtistTranslation.findOne({
      where: {
        artistId,
        languageCode,
      },
      transaction: t,
    });

    if (existingTranslation) {
      await t.rollback();

      return res.status(400).json({
        msg: "Für diese:n Artist existiert bereits eine Übersetzung in dieser Sprache.",
      });
    }

    const translation = await ArtistTranslation.create(
      {
        artistId,
        languageCode,
        firstName,
        lastName,
        description,
        country,
        aiGenerated: false,
        isScreen: false,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      artistId: translation.artistId,
      languageCode: translation.languageCode,
      firstName: translation.firstName,
      lastName: translation.lastName,
      description: translation.description,
      country: translation.country,
      isScreen: translation.isScreen,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die ArtistTranslation konnte nicht angelegt werden.",
    });
  }
};

export const updateArtistTranslation = async (
  req: Request<{
    artistId: string;
    languageCode: string;
  }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { artistId, languageCode } = req.params;

    const { firstName, lastName, description, country } = req.body;

    // überprüfen, dass die:der Artist existiert und nicht gelöscht wurde
    const artist = await Artist.findOne({
      where: {
        id: artistId,
        isDeleted: false,
      },
      transaction: t,
    });

    if (!artist) {
      await t.rollback();

      return res.status(404).json({
        msg: "Der Artist wurde nicht gefunden.",
      });
    }

    // Translation über artistId + languageCode suchen
    const translation = await ArtistTranslation.findOne({
      where: {
        artistId,
        languageCode,
      },
      transaction: t,
    });

    if (!translation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die ArtistTranslation wurde nicht gefunden.",
      });
    }

    await translation.update(
      {
        firstName,
        lastName,
        description,
        country,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      artistId: translation.artistId,
      languageCode: translation.languageCode,
      firstName: translation.firstName,
      lastName: translation.lastName,
      description: translation.description,
      country: translation.country,
      isScreen: translation.isScreen,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die ArtistTranslation konnte nicht aktualisiert werden.",
    });
  }
};
