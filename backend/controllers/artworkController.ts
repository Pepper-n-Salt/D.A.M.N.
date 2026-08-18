import type { Request, Response } from "express";

import {
  Artwork,
  ArtworkTranslation,
  ArtworkArtistAssociation,
  User,
  Artist,
} from "../models";

import db from "../lib/db";

import { processArtworkTranslation } from "../services/artworkMistralService.ts";

/*
 * --------------------------------------------------------------------------
 * Hilfsfunktion
 * --------------------------------------------------------------------------
 *
 * Erstellt aus einem Artwork + Translation die Response-Struktur.
 *
 * Die Artist-IDs werden aus der N:M-Association übernommen.
 * Dadurch bekommt das Frontend direkt:
 *
 * artists: ["artist-id-1", "artist-id-2"]
 *
 * Zusätzlich wird der Name des Erstellers aus dem geladenen Creator
 * zusammengesetzt:
 *
 * createdByName: "Max Mustermann"
 * --------------------------------------------------------------------------
 */

const createArtworkResponse = (
  artwork: Artwork,
  translation: ArtworkTranslation | undefined,
  artistIds: string[] = []
) => {
  const artworkWithCreator = artwork as Artwork & {
    creator?: User;
  };

  return {
    id: artwork.id,

    year: artwork.year,
    dimensions: artwork.dimensions,
    imageId: artwork.imageId,

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

    artists: artistIds,

    isScreen: translation?.isScreen,
  };
};

/*
 * --------------------------------------------------------------------------
 * Alle Artworks abrufen
 * --------------------------------------------------------------------------
 */

export const showAllArtworks = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    const artworks = await Artwork.findAll({
      where: {
        isDeleted: false,
      },

      include: [
        /*
         * Translation
         */
        {
          model: ArtworkTranslation,
          where: {
            languageCode,
          },
        },

        /*
         * Creator
         */
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },

        /*
         * Artists
         *
         * Artwork <-> Artist ist eine N:M-Beziehung.
         */
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
        },
      ],
    });

    const result = artworks.map((artwork) => {
      const translation = artwork.ArtworkTranslations?.[0];

      /*
       * Die über die N:M-Association geladenen Artists auslesen.
       *
       * Sequelize hängt sie unter artwork.artists an.
       */
      const artworkWithArtists = artwork as Artwork & {
        artists?: Artist[];
      };

      const artistIds =
        artworkWithArtists.artists?.map((artist) => artist.id) ?? [];

      return createArtworkResponse(artwork, translation, artistIds);
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

    const singleArtwork = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: false,
      },

      include: [
        /*
         * Translation
         */
        {
          model: ArtworkTranslation,
          where: {
            languageCode,
          },
        },

        /*
         * Creator
         */
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },

        /*
         * Artists
         */
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
        },
      ],
    });

    if (!singleArtwork) {
      return res.status(404).json({
        msg: "Artwork wurde nicht gefunden.",
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

    const artistIds =
      artworkWithArtists.artists?.map((artist) => artist.id) ?? [];

    return res
      .status(200)
      .json(createArtworkResponse(singleArtwork, translation, artistIds));
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Neues Artwork inklusive erster Übersetzung und Artists anlegen
 * --------------------------------------------------------------------------
 *
 * Ablauf:
 *
 * 1. Body lesen
 * 2. KI-Übersetzung validieren
 * 3. DB-Transaktion starten
 * 4. Artwork erstellen
 * 5. Translation erstellen
 * 6. Artist-Verknüpfungen erstellen
 * 7. Transaktion committen
 * 8. Artwork inklusive Creator zurückgeben
 * --------------------------------------------------------------------------
 */

export const createArtwork = async (req: Request, res: Response) => {
  try {
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

    /*
     * ----------------------------------------------------------------------
     * KI-Übersetzung prüfen
     * ----------------------------------------------------------------------
     */

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

    /*
     * ----------------------------------------------------------------------
     * Transaktion starten
     * ----------------------------------------------------------------------
     */

    const t = await db.transaction();

    try {
      /*
       * Artwork erstellen
       */

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
        {
          transaction: t,
        }
      );

      /*
       * Erste Translation erstellen
       */

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

      /*
       * Artist-Verknüpfungen erstellen
       *
       * Beispiel:
       *
       * artists = [
       *   "artist-uuid-1",
       *   "artist-uuid-2"
       * ]
       *
       * wird zu:
       *
       * artwork_artist_association
       *
       * artworkId | artistId
       * ----------|----------
       * artwork   | artist-1
       * artwork   | artist-2
       */

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

      /*
       * Alles erfolgreich
       */

      await t.commit();

      /*
       * --------------------------------------------------------------------
       * Artwork inklusive Creator erneut laden
       * --------------------------------------------------------------------
       *
       * Artwork.create() lädt die Association "creator" noch nicht.
       * Deshalb laden wir das Artwork nach dem Commit erneut.
       */

      const artworkWithCreator = await Artwork.findOne({
        where: {
          id: artwork.id,
        },

        include: [
          {
            model: User,
            as: "creator",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      if (!artworkWithCreator) {
        return res.status(500).json({
          msg: "Das erstellte Artwork konnte nicht erneut geladen werden.",
        });
      }

      /*
       * Response
       */

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
 * Artwork und zugehörige Übersetzung aktualisieren
 * --------------------------------------------------------------------------
 *
 * Aktualisiert:
 *
 * - Artwork
 *   - year
 *   - dimensions
 *   - imageId
 *
 * - Translation
 *   - title
 *   - subtitle
 *   - country
 *   - origin
 *   - material
 *   - description
 *
 * - Artists
 *   - bestehende Verknüpfungen werden entfernt
 *   - neue Verknüpfungen werden angelegt
 *
 * Wenn "artists" nicht im Request vorhanden ist, bleiben die
 * bestehenden Artist-Verknüpfungen unverändert.
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

    /*
     * ----------------------------------------------------------------------
     * Artwork suchen
     * ----------------------------------------------------------------------
     */

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

    /*
     * ----------------------------------------------------------------------
     * Translation suchen
     * ----------------------------------------------------------------------
     */

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

    /*
     * ----------------------------------------------------------------------
     * Artwork aktualisieren
     * ----------------------------------------------------------------------
     *
     * Nur tatsächlich übergebene Werte verändern.
     *
     * Das ist besonders wichtig bei PATCH.
     */

    const artworkUpdate: {
      year?: number;
      dimensions?: string | null;
      imageId?: string;
      lastEditedBy: string;
    } = {
      lastEditedBy: req.user!.id,
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

    /*
     * ----------------------------------------------------------------------
     * Translation aktualisieren
     * ----------------------------------------------------------------------
     */

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
     * ----------------------------------------------------------------------
     * Artists aktualisieren
     * ----------------------------------------------------------------------
     *
     * Nur wenn "artists" tatsächlich im PATCH enthalten ist.
     *
     * Ein leeres Array bedeutet bewusst:
     *
     * "Alle Artists entfernen."
     */

    if (artists !== undefined) {
      /*
       * Bestehende Associations entfernen
       */

      await ArtworkArtistAssociation.destroy({
        where: {
          artworkId,
        },

        transaction: t,
      });

      /*
       * Neue Associations anlegen
       */

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

    /*
     * ----------------------------------------------------------------------
     * Transaktion committen
     * ----------------------------------------------------------------------
     */

    await t.commit();

    /*
     * ----------------------------------------------------------------------
     * Artist-IDs für Response bestimmen
     * ----------------------------------------------------------------------
     *
     * Wenn artists im Request vorhanden war, können wir diese direkt
     * zurückgeben.
     *
     * Falls artists nicht übergeben wurde, laden wir die aktuellen
     * Associations aus der DB.
     */

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

    /*
     * ----------------------------------------------------------------------
     * Artwork inklusive Creator erneut laden
     * ----------------------------------------------------------------------
     *
     * Dadurch steht createdByName auch nach einem PATCH zur Verfügung.
     */

    const artworkWithCreator = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: false,
      },

      include: [
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    if (!artworkWithCreator) {
      return res.status(500).json({
        msg: "Das aktualisierte Artwork konnte nicht erneut geladen werden.",
      });
    }

    /*
     * ----------------------------------------------------------------------
     * Response
     * ----------------------------------------------------------------------
     */

    return res
      .status(200)
      .json(
        createArtworkResponse(artworkWithCreator, artworkTranslation, artistIds)
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
 * Artwork per Soft Delete als gelöscht markieren
 * --------------------------------------------------------------------------
 */

export const deleteArtwork = async (
  req: Request<{ artworkId: string }>,
  res: Response
) => {
  try {
    const { artworkId } = req.params;

    const artwork = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: false,
      },
    });

    if (!artwork) {
      return res.status(404).json({
        msg: "Das Artwork konnte nicht gefunden werden.",
      });
    }

    await artwork.update({
      isDeleted: true,
      lastEditedBy: req.user!.id,
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
 * Gelöschte Artworks laden
 * --------------------------------------------------------------------------
 */

export const showDeletedArtworks = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    const artworks = await Artwork.findAll({
      where: {
        isDeleted: true,
      },

      include: [
        /*
         * Translation
         */
        {
          model: ArtworkTranslation,
          where: {
            languageCode,
          },
        },

        /*
         * Creator
         */
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },

        /*
         * Artists
         */
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
        },
      ],
    });

    const result = artworks.map((artwork) => {
      const translation = artwork.ArtworkTranslations?.[0];

      const artworkWithArtists = artwork as Artwork & {
        artists?: Artist[];
      };

      const artistIds =
        artworkWithArtists.artists?.map((artist) => artist.id) ?? [];

      return createArtworkResponse(artwork, translation, artistIds);
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
 */

export const restoreArtwork = async (
  req: Request<{ artworkId: string }>,
  res: Response
) => {
  try {
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
      lastEditedBy: req.user!.id,
    });

    return res.status(200).json(artwork);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Das Artwork konnte nicht wiederhergestellt werden.",
    });
  }
};
