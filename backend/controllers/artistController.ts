import crypto from "node:crypto";
import type { Request, Response } from "express";

import { Artist, ArtistTranslation, User, Media } from "../models";
import db from "../lib/db";
import { processArtistTranslation } from "../services/artistMistralService.ts";

/*
 * --------------------------------------------------------------------------
 * Hilfsfunktion:
 * Artist anhand der Organisation des Users suchen
 * --------------------------------------------------------------------------
 *
 * SUPER:
 *   darf alle Artists sehen.
 *
 * ADMIN / USER:
 *   darf nur Artists sehen, deren Creator derselben Organisation angehört.
 */

const findAccessibleArtist = async (
  artistId: string,
  user: NonNullable<Request["user"]>,
  transaction?: any
) => {
  const isSuper = user.role === "super";

  return Artist.findOne({
    where: {
      id: artistId,
      isDeleted: false,
    },

    include: [
      {
        model: User,
        as: "creator",

        ...(isSuper
          ? {}
          : {
              where: {
                organisationId: user.organisationId,
              },
            }),
      },
    ],

    ...(transaction ? { transaction } : {}),
  });
};

/*
 * --------------------------------------------------------------------------
 * Alle Artists abrufen
 * --------------------------------------------------------------------------
 *
 * SUPER:
 *   sieht alle Artists.
 *
 * ADMIN / USER:
 *   sehen nur Artists der eigenen Organisation.
 *
 * Wird z. B. für das Select-/Suchfeld im Artwork-Formular verwendet.
 */

export const showAllArtists = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const isSuper = req.user.role === "super";

    if (!isSuper && !req.user.organisationId) {
      return res.status(403).json({
        msg: "Keine Organisation zugeordnet.",
      });
    }

    const artists = await Artist.findAll({
      where: {
        isDeleted: false,
      },

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

          ...(isSuper
            ? {}
            : {
                where: {
                  organisationId: req.user.organisationId,
                },
              }),

          attributes: ["id", "firstName", "lastName", "organisationId"],
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

/*
 * --------------------------------------------------------------------------
 * Einzelnen nicht gelöschten Artist abrufen
 * --------------------------------------------------------------------------
 */

export const showOneArtist = async (
  req: Request<{ artistId: string; languageCode: string }>,
  res: Response
) => {
  try {
    const { artistId, languageCode } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const isSuper = req.user.role === "super";

    if (!isSuper && !req.user.organisationId) {
      return res.status(403).json({
        msg: "Keine Organisation zugeordnet.",
      });
    }

    const artist = await Artist.findOne({
      where: {
        id: artistId,
        isDeleted: false,
      },

      include: [
        {
          model: ArtistTranslation,
          where: {
            languageCode,
          },
        },

        {
          model: Media,
          attributes: ["id", "fileUrl"],
        },

        {
          model: User,
          as: "creator",

          ...(isSuper
            ? {}
            : {
                where: {
                  organisationId: req.user.organisationId,
                },
              }),

          attributes: ["id", "firstName", "lastName", "organisationId"],
        },
      ],
    });

    if (!artist) {
      return res.status(404).json({
        msg: "Der Artist wurde nicht gefunden oder du hast keinen Zugriff.",
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
      isScreen: translation.isScreen,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

// Artist ohne Auth für Screens anzeigen
export const showPublicArtist = async (
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
          where: {
            languageCode,
          },
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
      isScreen: translation.isScreen,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Neuen Artist erstellen
 * --------------------------------------------------------------------------
 */

export const createArtist = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

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
          createdBy: req.user.id,
          lastEditedBy: req.user.id,
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

/*
 * --------------------------------------------------------------------------
 * Artist aktualisieren
 * --------------------------------------------------------------------------
 */

export const updateArtist = async (
  req: Request<{ artistId: string; languageCode: string }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { artistId, languageCode } = req.params;

    if (!req.user) {
      await t.rollback();

      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const {
      firstName,
      lastName,
      dateOfBirth,
      dateOfDeath,
      country,
      description,
      imageId,
    } = req.body;

    const artist = await findAccessibleArtist(artistId, req.user, t);

    if (!artist) {
      await t.rollback();

      return res.status(404).json({
        msg: "Der Artist wurde nicht gefunden oder du hast keinen Zugriff.",
      });
    }

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
        lastEditedBy: req.user.id,
      },
      {
        transaction: t,
      }
    );

    await artistTranslation.update(
      {
        firstName,
        lastName,
        country,
        description,
      },
      {
        transaction: t,
      }
    );

    await t.commit();

    return res.status(200).json({
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

    console.error(e);

    return res.status(500).json({
      msg: "Der Artist konnte nicht aktualisiert werden.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Artist per Soft Delete löschen
 * --------------------------------------------------------------------------
 */

export const deleteArtist = async (
  req: Request<{ artistId: string }>,
  res: Response
) => {
  try {
    const { artistId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const artist = await findAccessibleArtist(artistId, req.user);

    if (!artist) {
      return res.status(404).json({
        msg: "Der Artist konnte nicht gefunden werden oder du hast keinen Zugriff.",
      });
    }

    await artist.update({
      isDeleted: true,
      lastEditedBy: req.user.id,
    });

    return res.status(200).json(artist);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Der Artist konnte nicht als gelöscht markiert werden.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Gelöschte Artists anzeigen
 * --------------------------------------------------------------------------
 *
 * NUR SUPERUSER
 */

export const showDeletedArtists = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    if (req.user.role !== "super") {
      return res.status(403).json({
        msg: "Nur Superuser:innen haben Zugriff.",
      });
    }

    const { languageCode } = req.params;

    const artists = await Artist.findAll({
      where: {
        isDeleted: true,
      },

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
          attributes: ["id", "firstName", "lastName", "organisationId"],
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

/*
 * --------------------------------------------------------------------------
 * Artist wiederherstellen
 * --------------------------------------------------------------------------
 *
 * NUR SUPERUSER
 */

export const restoreArtist = async (
  req: Request<{ artistId: string }>,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    if (req.user.role !== "super") {
      return res.status(403).json({
        msg: "Nur Superuser:innen dürfen Artists wiederherstellen.",
      });
    }

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
      lastEditedBy: req.user.id,
    });

    return res.status(200).json(artist);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Der Artist konnte nicht wiederhergestellt werden.",
    });
  }
};
