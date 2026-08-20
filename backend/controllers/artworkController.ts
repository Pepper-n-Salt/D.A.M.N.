import crypto from "node:crypto";
import type { Request, Response } from "express";

import {
  Artwork,
  ArtworkTranslation,
  ArtworkArtistAssociation,
  User,
  Artist,
  ArtistTranslation,
  Media,
} from "../models";

import db from "../lib/db";

import { processArtworkTranslation } from "../services/artworkMistralService.ts";

/*
 * --------------------------------------------------------------------------
 * Hilfsfunktion:
 * Artwork anhand der Organisation des Users suchen
 * --------------------------------------------------------------------------
 *
 * SUPER:
 *   darf alle Artworks sehen.
 *
 * ADMIN / USER:
 *   darf nur Artworks sehen, deren Creator derselben Organisation
 *   angehört.
 */

const findAccessibleArtwork = async (
  artworkId: string,
  user: NonNullable<Request["user"]>,
  transaction?: any
) => {
  const isSuper = user.role === "super";

  return Artwork.findOne({
    where: {
      id: artworkId,
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
 * Gemeinsame Response-Funktion
 * --------------------------------------------------------------------------
 */

const createArtworkResponse = (
  artwork: Artwork,
  translation: ArtworkTranslation | undefined,
  artists: {
    id: string;
    firstName: string | null;
    lastName: string | null;
  }[] = []
) => {
  const artworkWithCreator = artwork as Artwork & {
    creator?: User;
  };

  return {
    id: artwork.id,

    year: artwork.year,
    dimensions: artwork.dimensions,
    imageId: artwork.imageId,
    fileUrl: artwork.Medium?.fileUrl ?? null,

    createdBy: artwork.createdBy,

    createdByName: artworkWithCreator.creator
      ? `${artworkWithCreator.creator.firstName} ${artworkWithCreator.creator.lastName}`
      : null,

    lastEditedBy: artwork.lastEditedBy,

    isDeleted: artwork.isDeleted,

    languageCode: translation?.languageCode,

    title: translation?.title,
    subtitle: translation?.subtitle,

    country: translation?.country,
    origin: translation?.origin,
    material: translation?.material,
    description: translation?.description,

    artists,

    isScreen: translation?.isScreen,
  };
};

/*
 * --------------------------------------------------------------------------
 * Alle Artworks abrufen
 * --------------------------------------------------------------------------
 *
 * SUPER:
 *   sieht alle Artworks.
 *
 * ADMIN / USER:
 *   sehen nur Artworks der eigenen Organisation.
 */

export const showAllArtworks = async (
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

    const artworks = await Artwork.findAll({
      where: {
        isDeleted: false,
      },

      include: [
        {
          model: ArtworkTranslation,
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

        {
          model: Artist,
          as: "artists",
          through: {
            attributes: [],
          },
          where: {
            isDeleted: false,
          },
          required: false,

          include: [
            {
              model: ArtistTranslation,
              where: {
                languageCode,
              },
              required: false,
            },
          ],
        },
      ],
    });

    const result = artworks.map((artwork) => {
      const translation = artwork.ArtworkTranslations?.[0];

      const artworkWithArtists = artwork as Artwork & {
        artists?: Artist[];
      };

      const artists = artworkWithArtists.artists ?? [];

      const artworkArtists = artists.map((artist) => {
        const artistTranslation = artist.ArtistTranslations?.[0];

        return {
          id: artist.id,
          firstName: artistTranslation?.firstName ?? null,
          lastName: artistTranslation?.lastName ?? null,
        };
      });

      return createArtworkResponse(artwork, translation, artworkArtists);
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
 * Einzelnes Artwork abrufen
 * --------------------------------------------------------------------------
 */

export const showOneArtwork = async (
  req: Request<{ artworkId: string; languageCode: string }>,
  res: Response
) => {
  try {
    const { artworkId, languageCode } = req.params;

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

    const singleArtwork = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: false,
      },

      include: [
        {
          model: ArtworkTranslation,
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

        {
          model: Artist,
          as: "artists",
          through: {
            attributes: [],
          },
          where: {
            isDeleted: false,
          },
          required: false,

          include: [
            {
              model: ArtistTranslation,
              where: {
                languageCode,
              },
              required: false,
            },
          ],
        },
      ],
    });

    if (!singleArtwork) {
      return res.status(404).json({
        msg: "Artwork wurde nicht gefunden oder du hast keinen Zugriff.",
      });
    }

    const translation = singleArtwork.ArtworkTranslations?.[0];

    if (!translation) {
      return res.status(404).json({
        msg: "Die Übersetzung des Artworks wurde nicht gefunden.",
      });
    }

    const artworkWithArtists = singleArtwork as Artwork & {
      artists?: Artist[];
    };

    const artists = artworkWithArtists.artists ?? [];

    const artworkArtists = artists.map((artist) => {
      const artistTranslation = artist.ArtistTranslations?.[0];

      return {
        id: artist.id,
        firstName: artistTranslation?.firstName ?? null,
        lastName: artistTranslation?.lastName ?? null,
      };
    });

    return res
      .status(200)
      .json(createArtworkResponse(singleArtwork, translation, artworkArtists));
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Neues Artwork erstellen
 * --------------------------------------------------------------------------
 */

export const createArtwork = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const {
      year,
      country,
      dimensions,
      imageId,
      languageCode,
      title,
      subtitle,
      origin,
      material,
      description,
      artists = [],
    } = req.body;

    const aiResult = await processArtworkTranslation({
      sourceLanguage: languageCode,
      country,
      title,
      subtitle,
      origin,
      material,
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
      const artwork = await Artwork.create(
        {
          id: crypto.randomUUID(),

          year,
          dimensions,
          imageId,

          createdBy: req.user.id,
          lastEditedBy: req.user.id,

          isDeleted: false,
        },
        {
          transaction: t,
        }
      );

      const artworkTranslation = await ArtworkTranslation.create(
        {
          artworkId: artwork.id,

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
        {
          transaction: t,
        }
      );

      if (artists.length > 0) {
        await ArtworkArtistAssociation.bulkCreate(
          artists.map((artistId: string) => ({
            id: crypto.randomUUID(),
            artworkId: artwork.id,
            artistId,
          })),
          {
            transaction: t,
          }
        );
      }

      await t.commit();

      const artworkWithCreator = await Artwork.findOne({
        where: {
          id: artwork.id,
        },

        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "firstName", "lastName", "organisationId"],
          },
        ],
      });

      if (!artworkWithCreator) {
        return res.status(500).json({
          msg: "Das erstellte Artwork konnte nicht erneut geladen werden.",
        });
      }

      return res
        .status(201)
        .json(
          createArtworkResponse(artworkWithCreator, artworkTranslation, artists)
        );
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
          : "Das Artwork konnte nicht erstellt werden.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Artwork und Übersetzung aktualisieren
 * --------------------------------------------------------------------------
 */

export const updateArtwork = async (
  req: Request<{
    artworkId: string;
    languageCode: string;
  }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { artworkId, languageCode } = req.params;

    if (!req.user) {
      await t.rollback();

      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const {
      year,
      dimensions,
      imageId,

      title,
      subtitle,
      country,
      origin,
      material,
      description,

      artists,
    } = req.body;

    const artwork = await findAccessibleArtwork(artworkId, req.user, t);

    if (!artwork) {
      await t.rollback();

      return res.status(404).json({
        msg: "Das Artwork wurde nicht gefunden oder du hast keinen Zugriff.",
      });
    }

    const artworkTranslation = await ArtworkTranslation.findOne({
      where: {
        artworkId,
        languageCode,
      },

      transaction: t,
    });

    if (!artworkTranslation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die ArtworkTranslation wurde nicht gefunden.",
      });
    }

    const artworkUpdate: {
      year?: number;
      dimensions?: string | null;
      imageId?: string;
      lastEditedBy: string;
    } = {
      lastEditedBy: req.user.id,
    };

    if (year !== undefined) {
      artworkUpdate.year = year;
    }

    if (dimensions !== undefined) {
      artworkUpdate.dimensions = dimensions;
    }

    if (imageId !== undefined) {
      artworkUpdate.imageId = imageId;
    }

    await artwork.update(artworkUpdate, {
      transaction: t,
    });

    const translationUpdate: {
      title?: string;
      subtitle?: string | null;
      country?: string | null;
      origin?: string | null;
      material?: string | null;
      description?: string | null;
    } = {};

    if (title !== undefined) {
      translationUpdate.title = title;
    }

    if (subtitle !== undefined) {
      translationUpdate.subtitle = subtitle;
    }

    if (country !== undefined) {
      translationUpdate.country = country;
    }

    if (origin !== undefined) {
      translationUpdate.origin = origin;
    }

    if (material !== undefined) {
      translationUpdate.material = material;
    }

    if (description !== undefined) {
      translationUpdate.description = description;
    }

    await artworkTranslation.update(translationUpdate, {
      transaction: t,
    });

    /*
     * Artists nur dann verändern, wenn "artists" tatsächlich
     * im Request enthalten ist.
     */

    if (artists !== undefined) {
      await ArtworkArtistAssociation.destroy({
        where: {
          artworkId,
        },

        transaction: t,
      });

      if (artists.length > 0) {
        await ArtworkArtistAssociation.bulkCreate(
          artists.map((artistId: string) => ({
            id: crypto.randomUUID(),
            artworkId,
            artistId,
          })),
          {
            transaction: t,
          }
        );
      }
    }

    await t.commit();

    let artistIds: string[];

    if (artists !== undefined) {
      artistIds = artists;
    } else {
      const associations = await ArtworkArtistAssociation.findAll({
        where: {
          artworkId,
        },
      });

      artistIds = associations.map((association) => association.artistId);
    }

    const artworkWithCreator = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: false,
      },

      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName", "organisationId"],
        },
      ],
    });

    if (!artworkWithCreator) {
      return res.status(500).json({
        msg: "Das aktualisierte Artwork konnte nicht erneut geladen werden.",
      });
    }

    return res
      .status(200)
      .json(
        createArtworkResponse(artworkWithCreator, artworkTranslation, artists)
      );
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Das Artwork konnte nicht aktualisiert werden.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Artwork per Soft Delete löschen
 * --------------------------------------------------------------------------
 */

export const deleteArtwork = async (
  req: Request<{ artworkId: string }>,
  res: Response
) => {
  try {
    const { artworkId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const artwork = await findAccessibleArtwork(artworkId, req.user);

    if (!artwork) {
      return res.status(404).json({
        msg: "Das Artwork konnte nicht gefunden werden oder du hast keinen Zugriff.",
      });
    }

    await artwork.update({
      isDeleted: true,
      lastEditedBy: req.user.id,
    });

    return res.status(200).json(artwork);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Das Artwork konnte nicht als gelöscht markiert werden.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Gelöschte Artworks anzeigen
 * --------------------------------------------------------------------------
 *
 * NUR SUPERUSER
 */

export const showDeletedArtworks = async (
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

    const artworks = await Artwork.findAll({
      where: {
        isDeleted: true,
      },

      include: [
        {
          model: ArtworkTranslation,
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

        {
          model: Artist,
          as: "artists",
          through: {
            attributes: [],
          },
          where: {
            isDeleted: false,
          },
          required: false,

          include: [
            {
              model: ArtistTranslation,
              where: {
                languageCode,
              },
              required: false,
            },
          ],
        },
      ],
    });

    const result = artworks.map((artwork) => {
      const translation = artwork.ArtworkTranslations?.[0];

      const artworkWithArtists = artwork as Artwork & {
        artists?: Artist[];
      };

      const artists = artworkWithArtists.artists ?? [];

      const artworkArtists = artists.map((artist) => {
        const artistTranslation = artist.ArtistTranslations?.[0];

        return {
          id: artist.id,
          firstName: artistTranslation?.firstName ?? null,
          lastName: artistTranslation?.lastName ?? null,
        };
      });

      return createArtworkResponse(artwork, translation, artworkArtists);
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
 * Artwork wiederherstellen
 * --------------------------------------------------------------------------
 *
 * NUR SUPERUSER
 */

export const restoreArtwork = async (
  req: Request<{ artworkId: string }>,
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
        msg: "Nur Superuser:innen dürfen Artworks wiederherstellen.",
      });
    }

    const { artworkId } = req.params;

    const artwork = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: true,
      },
    });

    if (!artwork) {
      return res.status(404).json({
        msg: "Das gelöschte Artwork konnte nicht gefunden werden.",
      });
    }

    await artwork.update({
      isDeleted: false,
      lastEditedBy: req.user.id,
    });

    return res.status(200).json(artwork);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Das Artwork konnte nicht wiederhergestellt werden.",
    });
  }
};
