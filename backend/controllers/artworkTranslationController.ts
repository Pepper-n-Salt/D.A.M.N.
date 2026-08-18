import type { Request, Response } from "express";
import db from "../lib/db.js";
import { Artwork, ArtworkTranslation } from "../models";
import { processArtworkTranslation } from "../services/artworkMistralService.ts";

export const previewArtworkTranslation = async (
  req: Request<{ artworkId: string }>,
  res: Response
) => {
  try {
    const { artworkId } = req.params;
    const { targetLanguage } = req.body;

    const artwork = await Artwork.findOne({
      where: {
        id: artworkId,
        isDeleted: false,
      },
      include: [
        {
          model: ArtworkTranslation,
        },
      ],
    });

    if (!artwork) {
      return res.status(404).json({
        msg: "Das Artwork wurde nicht gefunden.",
      });
    }

    if (targetLanguage !== "de" && targetLanguage !== "en") {
      return res.status(400).json({
        msg: "Ungültige Zielsprache.",
      });
    }

    /*
     * Die Source-Language ist immer die jeweils andere Sprache.
     */

    const sourceLanguage = targetLanguage === "de" ? "en" : "de";

    const sourceTranslation = artwork.ArtworkTranslations?.find(
      (translation) => translation.languageCode === sourceLanguage
    );

    if (!sourceTranslation) {
      return res.status(404).json({
        msg: "Die Ausgangsübersetzung des Artworks wurde nicht gefunden.",
      });
    }

    const existingTranslation = artwork.ArtworkTranslations?.find(
      (translation) => translation.languageCode === targetLanguage
    );

    if (existingTranslation) {
      return res.status(200).json({
        artworkId: existingTranslation.artworkId,
        languageCode: existingTranslation.languageCode,
        title: existingTranslation.title,
        subtitle: existingTranslation.subtitle,
        country: existingTranslation.country,
        origin: existingTranslation.origin,
        material: existingTranslation.material,
        description: existingTranslation.description,
        alreadyExists: true,
        aiGenerated: existingTranslation.aiGenerated,
      });
    }

    const aiResult = await processArtworkTranslation({
      sourceLanguage,
      title: sourceTranslation.title,
      subtitle: sourceTranslation.subtitle,
      country: sourceTranslation.country,
      origin: sourceTranslation.origin,
      material: sourceTranslation.material,
      description: sourceTranslation.description,
    });

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

    return res.status(200).json({
      artworkId: artwork.id,
      languageCode: aiResult.targetLanguage,
      title: aiResult.translation.title,
      subtitle: aiResult.translation.subtitle,
      country: aiResult.translation.country,
      origin: aiResult.translation.origin,
      material: aiResult.translation.material,
      description: aiResult.translation.description,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Artwork Translation konnte nicht erstellt werden.",
    });
  }
};

// weitere Übersetzung für ein bestehendes Artwork anlegen
// getestet: klappt!
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
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die ArtworkTranslation konnte nicht angelegt werden.",
    });
  }
};

// diese weitere Übersetzung für ein bereits bestehendes Artwork editieren
// getestet: klappt auch!
export const updateArtworkTranslation = async (
  req: Request<{
    artworkId: string;
    languageCode: string;
  }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { artworkId, languageCode } = req.params;

    const { title, subtitle, country, origin, material, description } =
      req.body;

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

      return res.status(404).json({ msg: "Das Artwork wurde nicht gefunden." });
    }

    // Translation über den kombinierten Primary Key suchen
    const translation = await ArtworkTranslation.findOne({
      where: {
        artworkId,
        languageCode,
      },
      transaction: t,
    });

    if (!translation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die ArtworkTranslation wurde nicht gefunden.",
      });
    }

    await translation.update(
      {
        title,
        subtitle,
        country,
        origin,
        material,
        description,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
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
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die ArtworkTranslation konnte nicht aktualisiert werden.",
    });
  }
};
