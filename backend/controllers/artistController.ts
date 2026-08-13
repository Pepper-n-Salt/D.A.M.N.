import type { Request, Response } from "express";
import { Artist, ArtistTranslation } from "../models";
import db from "../lib/db";

// Alle Artists abrufen
// Wird z. B. für das Select-/Suchfeld im Artwork-Formular verwendet
// getestet: klappt!
export const showAllArtists = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    const artists = await Artist.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: ArtistTranslation,
          where: {
            languageCode,
          },
        },
      ],
    });

    const result = artists.map((artist) => {
      const translation = artist.ArtistTranslations?.[0];

      return {
        id: artist.id,
        imageId: artist.imageId,
        dateOfBirth: artist.dateOfBirth,
        dateOfDeath: artist.dateOfDeath,
        createdBy: artist.createdBy,
        lastEditedBy: artist.lastEditedBy,
        isDeleted: artist.isDeleted,

        languageCode: translation?.languageCode,
        firstName: translation?.firstName,
        lastName: translation?.lastName,
        description: translation?.description,
        country: translation?.country,
        // aiGenerated: translation?.aiGenerated,
        isScreen: translation?.isScreen,
      };
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

// Einzelnen nicht gelöschten Artist abrufen
// getestet: klappt!
export const showOneArtist = async (
  req: Request<{ artistId: string; languageCode: string }>,
  res: Response
) => {
  try {
    const { artistId, languageCode } = req.params;

    const artist = await Artist.findOne({
      where: {
        id: artistId,
        isDeleted: false,
      },
      include: [
        {
          model: ArtistTranslation,
          where: { languageCode },
        },
      ],
    });

    if (!artist) {
      return res.status(404).json({
        msg: "Der Artist wurde nicht gefunden.",
      });
    }

    const translation = artist.ArtistTranslations?.[0];

    if (!translation) {
      return res.status(404).json({
        msg: "Die Übersetzung des Artists wurde nicht gefunden.",
      });
    }

    return res.status(200).json({
      id: artist.id,
      imageId: artist.imageId,
      dateOfBirth: artist.dateOfBirth,
      dateOfDeath: artist.dateOfDeath,
      createdBy: artist.createdBy,
      lastEditedBy: artist.lastEditedBy,
      isDeleted: artist.isDeleted,

      languageCode: translation.languageCode,
      firstName: translation.firstName,
      lastName: translation.lastName,
      country: translation.country,
      description: translation.description,
      // aiGenerated: translation.aiGenerated,
      isScreen: translation.isScreen,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

// Neuen Artist als kompletten Datensatz, also inklusive der ersten "Translation", anlegen
// getestet: klappt!
export const createArtist = async (req: Request, res: Response) => {
  const t = await db.transaction();
  try {
    const {
      languageCode,
      firstName,
      lastName,
      dateOfBirth,
      dateOfDeath,
      country,
      description,
      imageId,
    } = req.body;

    const artist = await Artist.create(
      {
        id: crypto.randomUUID(),
        imageId,
        dateOfBirth,
        dateOfDeath,
        createdBy: req.user!.id,
        lastEditedBy: req.user!.id,
        isDeleted: false,
      },
      { transaction: t }
    );

    const artistTranslation = await ArtistTranslation.create(
      {
        artistId: artist.id,
        languageCode,
        firstName,
        lastName,
        country,
        description,
        aiGenerated: false,
        isScreen: false,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      id: artist.id,
      imageId: artist.imageId,
      dateOfBirth: artist.dateOfBirth,
      dateOfDeath: artist.dateOfDeath,
      createdBy: artist.createdBy,
      lastEditedBy: artist.lastEditedBy,

      languageCode: artistTranslation.languageCode,
      firstName: artistTranslation.firstName,
      lastName: artistTranslation.lastName,
      country: artistTranslation.country,
      description: artistTranslation.description,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Der Artist konnte nicht angelegt werden.",
    });
  }
};

// Artist und die dazugehörige Übersetzung aktualisieren
// getestet: klappt!
export const updateArtist = async (
  req: Request<{ artistId: string; languageCode: string }>,
  res: Response
) => {
  const t = await db.transaction();
  try {
    const { artistId, languageCode } = req.params;

    const {
      firstName,
      lastName,
      dateOfBirth,
      dateOfDeath,
      country,
      description,
      imageId,
    } = req.body;

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

    // languageCode ist Bestandteil des zusammengesetzten Primary Keys
    const artistTranslation = await ArtistTranslation.findOne({
      where: {
        artistId,
        languageCode,
      },
      transaction: t,
    });

    if (!artistTranslation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die ArtistTranslation wurde nicht gefunden.",
      });
    }

    await artist.update(
      {
        imageId,
        dateOfBirth,
        dateOfDeath,
        lastEditedBy: req.user!.id,
      },
      { transaction: t }
    );

    await artistTranslation.update(
      {
        firstName,
        lastName,
        country,
        description,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      id: artist.id,
      imageId: artist.imageId,
      dateOfBirth: artist.dateOfBirth,
      dateOfDeath: artist.dateOfDeath,
      lastEditedBy: artist.lastEditedBy,

      firstName: artistTranslation.firstName,
      lastName: artistTranslation.lastName,
      country: artistTranslation.country,
      description: artistTranslation.description,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Der Artist konnte nicht aktualisiert werden.",
    });
  }
};

// Artist per Soft Delete als gelöscht markieren
// getestet: klappt!
export const deleteArtist = async (
  req: Request<{ artistId: string }>,
  res: Response
) => {
  try {
    const { artistId } = req.params;

    const artist = await Artist.findOne({
      where: {
        id: artistId,
        isDeleted: false,
      },
    });

    if (!artist) {
      return res.status(404).json({
        msg: "Der Artist konnte nicht gefunden werden.",
      });
    }

    await artist.update({
      isDeleted: true,
      lastEditedBy: req.user!.id,
    });

    return res.status(200).json(artist);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Der Artist konnte nicht als gelöscht markiert werden.",
    });
  }
};
