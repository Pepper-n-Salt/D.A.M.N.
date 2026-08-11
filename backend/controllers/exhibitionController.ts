import type { Request, Response } from "express";
import { Exhibition, ExhibitionTranslation } from "../models";
import db from "../lib/db";

// Alle nicht gelöschten Exhibitions abrufen
// getestet: klappt!
export const showAllExhibitions = async (req: Request, res: Response) => {
  try {
    const exhibitions = await Exhibition.findAll({
      where: { isDeleted: false },
    });

    return res.status(200).json(exhibitions);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// Einzelne, nicht gelöschte Exhibition abrufen
// getestet: klappt!
export const showOneExhibition = async (
  req: Request<{ exhibitionId: string }>, // für TS: Parameter req mit einem generischen Request-Typ typisiert, dessen Type Argument ein Object Type Literal ist
  res: Response
) => {
  try {
    // Exhibition ID aus der URL holen
    const { exhibitionId } = req.params;

    // nicht gelöschte Exhibition über ID in DB suchen
    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
    });

    if (!exhibition) {
      return res.status(404).json({ msg: "Exhibition nicht gefunden." });
    }

    // Exhibition zurückgeben, wenn efolgreich
    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler" });
  }
};

// Neue Exhibition inklusive der ersten Übersetzung erstellen
// getestet: klappt!
export const createExhibition = async (req: Request, res: Response) => {
  const t = await db.transaction();

  try {
    const {
      coverImageId,
      startDate,
      endDate,
      languageCode,
      title,
      subtitle,
      location,
      description,
    } = req.body;

    // hier ggfs. in der Silver-Edition weitere Felder hinzufügen
    const exhibition = await Exhibition.create(
      {
        id: crypto.randomUUID(),
        coverImageId,
        startDate,
        endDate,
        createdBy: req.user!.id,
        lastEditedBy: req.user!.id,
        isArchived: false, // Info kommt vom BE
        isDeleted: false, // Info kommt vom BE
      },
      { transaction: t }
    );

    const translation = await ExhibitionTranslation.create(
      {
        exhibitionId: exhibition.id,
        languageCode,
        title,
        subtitle,
        location,
        description,
        aiGenerated: false, // Info kommt vom BE
        isScreen: false, // Info kommt vom BE
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      exhibition,
      translation,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Server error.",
    });
  }
};

// Exhibition und die dazugehörige Übersetzung aktualisieren
// getestet: klappt!
export const updateExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    // Exhibition ID wieder aus der URL holen
    const { exhibitionId } = req.params;

    // Formularfelder aus dem FE holen // hier ggfs. in der Silver-Edition weitere Felder hinzufügen
    const {
      coverImageId,
      startDate,
      endDate,
      languageCode,
      title,
      subtitle,
      location,
      description,
    } = req.body;

    // einzelne, nicht gelöschte Exhibition in DB suchen
    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
      transaction: t,
    });

    if (!exhibition) {
      await t.rollback();

      return res
        .status(404)
        .json({ msg: "Die Exhibition wurde nicht gefunden." });
    }

    // languageCode ist Bestandteil des zusammengesetzten Primary Keys der Translation.
    const translation = await ExhibitionTranslation.findOne({
      where: { exhibitionId, languageCode },
      transaction: t,
    });

    if (!translation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die ExhibitionTranslation wurde nicht gefunden.",
      });
    }

    await exhibition.update(
      {
        coverImageId,
        startDate,
        endDate,
        lastEditedBy: req.user!.id,
      },
      { transaction: t }
    );

    await translation.update(
      { title, subtitle, location, description },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({ exhibition, translation });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht aktualisiert werden.",
    });
  }
};

// noch nicht gelöschte Exhibition archivieren
// getestet: klappt!
export const archiveExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    const { exhibitionId } = req.params;

    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
    });

    if (!exhibition) {
      return res
        .status(404)
        .json({ msg: "Die Exhibition konnte nicht gefunden werden." });
    }

    await exhibition.update({ isArchived: true, lastEditedBy: req.user!.id });

    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht archiviert werden.",
    });
  }
};

// Exhibition per Soft Delete als gelöscht markieren
// getestet: klappt!
export const deleteExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    const { exhibitionId } = req.params;

    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
    });

    if (!exhibition) {
      return res
        .status(404)
        .json({ msg: "Die Exhibition konnte nicht gefunden werden." });
    }

    await exhibition.update({ isDeleted: true, lastEditedBy: req.user!.id });

    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht als gelöscht markiert werden.",
    });
  }
};
