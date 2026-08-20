import type { Request, Response } from "express";
import { Artist, ArtistTranslation, User, Media } from "../models";
import db from "../lib/db";
import { processArtistTranslation } from "../services/artistMistralService.ts";

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
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: Media,
          attributes: ["id", "fileUrl"],
        },
      ],
    });

    const result = artists.map((artist) => {
      const translation = artist.ArtistTranslations?.[0];

      return {
        id: artist.id,
        imageId: artist.imageId,
        fileUrl: artist.Medium?.fileUrl ?? null,
        dateOfBirth: artist.dateOfBirth,
        dateOfDeath: artist.dateOfDeath,
        createdBy: artist.createdBy,
        createdByName: artist.creator
          ? `${artist.creator.firstName} ${artist.creator.lastName}`
          : null,
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
        {
          model: Media,
          attributes: ["id", "fileUrl"],
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
      fileUrl: artist.Medium?.fileUrl ?? null,
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

    const aiResult = await processArtistTranslation({
      sourceLanguage: languageCode,
      firstName,
      lastName,
      country,
      description,
    });

    if (aiResult.sourceLanguage !== languageCode) {
      return res.status(422).json({
        msg: "Die Ausgangssprache stimmt nicht mit der angegebenen Sprache überein.",

        aiValidation: {
          sourceLanguage: aiResult.sourceLanguage,
          expectedLanguage: languageCode,
        },
      });
    }

    if (aiResult.targetLanguage !== (languageCode === "de" ? "en" : "de")) {
      return res.status(422).json({
        msg: "Die Zielsprache der KI-Antwort ist ungültig.",
      });
    }

    const t = await db.transaction();

    try {
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
        {
          transaction: t,
        }
      );

      const artistTranslation = await ArtistTranslation.create(
        {
          artistId: artist.id,
          languageCode,

          firstName: aiResult.corrected.firstName,

          lastName: aiResult.corrected.lastName,

          country: aiResult.corrected.country ?? country,

          description: aiResult.corrected.description,

          aiGenerated: false,
          isScreen: false,
        },
        {
          transaction: t,
        }
      );

      await t.commit();

      return res.status(201).json({
        id: artist.id,
        imageId: artist.imageId,
        dateOfBirth: artist.dateOfBirth,
        dateOfDeath: artist.dateOfDeath,
        createdBy: artist.createdBy,
        lastEditedBy: artist.lastEditedBy,
        isDeleted: artist.isDeleted,

        languageCode: artistTranslation.languageCode,

        firstName: artistTranslation.firstName,

        lastName: artistTranslation.lastName,

        country: artistTranslation.country,

        description: artistTranslation.description,
      });
    } catch (e) {
      await t.rollback();
      throw e;
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg:
        e instanceof Error
          ? e.message
          : "Der Artist konnte nicht erstellt werden.",
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

export const showDeletedArtists = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    const artists = await Artist.findAll({
      where: { isDeleted: true },
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
export const restoreArtist = async (
  req: Request<{ artistId: string }>,
  res: Response
) => {
  try {
    const { artistId } = req.params;

    const artist = await Artist.findOne({
      where: {
        id: artistId,
        isDeleted: true,
      },
    });

    if (!artist) {
      return res.status(404).json({
        msg: "Der gelöschte Artist konnte nicht gefunden werden.",
      });
    }

    await artist.update({
      isDeleted: false,
      lastEditedBy: req.user!.id,
    });

    return res.status(200).json(artist);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Der Artist konnte nicht wiederhergestellt werden.",
    });
  }
};
