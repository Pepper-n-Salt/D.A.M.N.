import type { Request, Response } from "express";

import db from "../lib/db.js";

import { Artist, ArtistTranslation } from "../models";

import { processArtistTranslation } from "../services/artistMistralService.js";

/*
 * --------------------------------------------------------------------------
 * Artist Translation Preview
 * --------------------------------------------------------------------------
 */

export const previewArtistTranslation = async (
  req: Request<{ artistId: string }>,
  res: Response
) => {
  try {
    const { artistId } = req.params;
    const { targetLanguage } = req.body;

    /*
     * Artist inklusive aller vorhandenen Übersetzungen laden.
     */

    const artist = await Artist.findOne({
      where: {
        id: artistId,
        isDeleted: false,
      },

      include: [
        {
          model: ArtistTranslation,
        },
      ],
    });

    if (!artist) {
      return res.status(404).json({
        msg: "Der Artist wurde nicht gefunden.",
      });
    }

    /*
     * Wir unterstützen aktuell nur Deutsch und Englisch.
     */

    if (targetLanguage !== "de" && targetLanguage !== "en") {
      return res.status(400).json({
        msg: "Ungültige Zielsprache.",
      });
    }

    /*
     * Die Source-Language ist immer die jeweils andere Sprache.
     */

    const sourceLanguage = targetLanguage === "de" ? "en" : "de";

    /*
     * Genau die Translation der Source-Language suchen.
     */

    const sourceTranslation = artist.ArtistTranslations?.find(
      (translation) => translation.languageCode === sourceLanguage
    );

    if (!sourceTranslation) {
      return res.status(404).json({
        msg: "Die Ausgangsübersetzung des Artists wurde nicht gefunden.",
      });
    }

    /*
     * Prüfen, ob die gewünschte Übersetzung
     * bereits existiert.
     */

    const existingTranslation = artist.ArtistTranslations?.find(
      (translation) => translation.languageCode === targetLanguage
    );

    if (existingTranslation) {
      return res.status(200).json({
        artistId: existingTranslation.artistId,

        languageCode: existingTranslation.languageCode,

        firstName: existingTranslation.firstName,

        lastName: existingTranslation.lastName,

        description: existingTranslation.description,

        country: existingTranslation.country,

        alreadyExists: true,

        aiGenerated: existingTranslation.aiGenerated,
      });
    }

    /*
     * KI-Übersetzung erstellen.
     *
     * Die Source-Language wird EXPLIZIT übergeben.
     */

    const aiResult = await processArtistTranslation({
      sourceLanguage,

      firstName: sourceTranslation.firstName,

      lastName: sourceTranslation.lastName,

      description: sourceTranslation.description,

      country: sourceTranslation.country,
    });

    /*
     * Sicherheitsprüfung.
     */

    if (aiResult.sourceLanguage !== sourceLanguage) {
      return res.status(502).json({
        msg: "Die Ausgangssprache der KI-Antwort ist ungültig.",
      });
    }

    if (aiResult.targetLanguage !== targetLanguage) {
      return res.status(502).json({
        msg: "Die Übersetzung wurde nicht in der gewünschten Sprache erstellt.",
      });
    }

    /*
     * Translation zurückgeben.
     *
     * Wichtig:
     * Noch NICHT in die Datenbank schreiben.
     */

    return res.status(200).json({
      artistId: artist.id,

      languageCode: aiResult.targetLanguage,

      firstName: aiResult.translation.firstName,

      lastName: aiResult.translation.lastName,

      description: aiResult.translation.description,

      country: aiResult.translation.country,

      alreadyExists: false,

      aiGenerated: true,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Artist Translation konnte nicht erstellt werden.",
    });
  }
};

/*
 * --------------------------------------------------------------------------
 * Neue Artist Translation erstellen
 * --------------------------------------------------------------------------
 */

export const createArtistTranslation = async (
  req: Request<{ artistId: string }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { artistId } = req.params;

    const { languageCode, firstName, lastName, description, country } =
      req.body;

    /*
     * Artist überprüfen.
     */

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

    /*
     * Prüfen, ob die Translation bereits existiert.
     */

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
        msg: "Für diesen Artist existiert bereits eine Übersetzung in dieser Sprache.",
      });
    }

    /*
     * Translation erstellen.
     */

    const translation = await ArtistTranslation.create(
      {
        artistId,
        languageCode,

        firstName,
        lastName,

        description,
        country,

        /*
         * Da der Benutzer die Übersetzung
         * möglicherweise noch bearbeitet hat,
         * speichern wir hier zunächst false.
         */

        aiGenerated: false,

        isScreen: false,
      },

      {
        transaction: t,
      }
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

/*
 * --------------------------------------------------------------------------
 * Artist Translation aktualisieren
 * --------------------------------------------------------------------------
 */

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

    /*
     * Artist überprüfen.
     */

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

    /*
     * Translation suchen.
     */

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

    /*
     * Translation aktualisieren.
     */

    await translation.update(
      {
        firstName,
        lastName,
        description,
        country,
      },

      {
        transaction: t,
      }
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
