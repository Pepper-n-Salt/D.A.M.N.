import type { Request, Response } from "express";
import { Artwork, ArtworkTranslation } from "../models";
import db from "../lib/db";

// Alle Artworks abrufen
// getestet: klappt!
export const showAllArtworks = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    const artworks = await Artwork.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: ArtworkTranslation,
          where: {
            languageCode,
          },
        },
      ],
    });

    const result = artworks.map((artwork) => {
      const translation = artwork.ArtworkTranslations?.[0];

      return {
        id: artwork.id,
        year: artwork.year,
        dimensions: artwork.dimensions,
        imageId: artwork.imageId,
        createdBy: artwork.createdBy,
        lastEditedBy: artwork.lastEditedBy,
        isDeleted: artwork.isDeleted,

        languageCode: translation?.languageCode,
        title: translation?.title,
        subtitle: translation?.subtitle,
        country: translation?.country,
        origin: translation?.origin,
        material: translation?.material,
        description: translation?.description,
        // aiGenerated: translation?.aiGenerated,
        isScreen: translation?.isScreen,
      };
    });

    return res.status(200).json(artworks);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// Einzelnes Artwork abrufen
// getestet: klappt!
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
        {
          model: ArtworkTranslation,
          where: { languageCode },
        },
      ],
    });

    if (!singleArtwork) {
      return res.status(404).json({ msg: "Artwork wurde nicht gefunden." });
    }

    const translation = singleArtwork.ArtworkTranslations?.[0];

    if (!translation) {
      return res.status(404).json({
        msg: "Die Übersetzung des Artworks wurde nicht gefunden.",
      });
    }

    return res.status(200).json({
      id: singleArtwork.id,
      year: singleArtwork.year,
      dimensions: singleArtwork.dimensions,
      imageId: singleArtwork.imageId,
      createdBy: singleArtwork.createdBy,
      lastEditedBy: singleArtwork.lastEditedBy,
      isDeleted: singleArtwork.isDeleted,

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

    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// Neues Artwork inklusive der ersten Übersetzung anlegen
// getestet: klappt!
// Es muss eine schon in der DB vorhandene imageId verwendet werden
export const createArtwork = async (req: Request, res: Response) => {
  const t = await db.transaction();

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
      { transaction: t }
    );

    await t.commit();

    // return res.status(201).json({ artwork, artworkTranslation });
    return res.status(201).json({
      id: artwork.id,
      year: artwork.year,
      dimensions: artwork.dimensions,
      imageId: artwork.imageId,
      createdBy: artwork.createdBy,
      lastEditedBy: artwork.lastEditedBy,
      isDeleted: artwork.isDeleted,

      languageCode: artworkTranslation.languageCode,
      title: artworkTranslation.title,
      subtitle: artworkTranslation.subtitle,
      country: artworkTranslation.country,
      origin: artworkTranslation.origin,
      material: artworkTranslation.material,
      description: artworkTranslation.description,
      // aiGenereated: artworkTranslation.aiGenerated,
      isScreen: artworkTranslation.isScreen,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// Artwork und die dazugehörige Übersetzung aktualisieren
// getestet: klappt jetzt endlich!
export const updateArtwork = async (
  req: Request<{ artworkId: string; languageCode: string }>,
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
    } = req.body;

    // Nicht gelöschtes Artwork suchen
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

    // languageCode ist Bestandteil des zusammengesetzten Primary Keys
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

    // Artwork aktualisieren
    await artwork.update(
      {
        year,
        dimensions,
        imageId,
        lastEditedBy: req.user!.id,
      },
      { transaction: t }
    );

    // Übersetzung aktualisieren
    await artworkTranslation.update(
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
      id: artwork.id,
      year: artwork.year,
      dimensions: artwork.dimensions,
      imageId: artwork.imageId,
      createdBy: artwork.createdBy,
      lastEditedBy: artwork.lastEditedBy,
      isDeleted: artwork.isDeleted,

      title: artworkTranslation.title,
      subtitle: artworkTranslation.subtitle,
      country: artworkTranslation.country,
      origin: artworkTranslation.origin,
      material: artworkTranslation.material,
      description: artworkTranslation.description,
      // aiGenereated: artworkTranslation.aiGenerated,
      isScreen: artworkTranslation.isScreen,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Das Artwork konnte nicht aktualisiert werden.",
    });
  }
};

// Artwork per Soft Delete als gelöscht markieren
// getestet: klappt!
export const deleteArtwork = async (req: Request, res: Response) => {
  try {
    const { artworkId } = req.params;

    console.log("DELETE PARAMS:", req.params);

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
