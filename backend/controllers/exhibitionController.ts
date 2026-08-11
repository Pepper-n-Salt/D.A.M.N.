import type { Request, Response } from "express";
import { Exhibition, ExhibitionTranslation } from "../models";
import db from "../lib/db";

// getestet: funktioniert
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

    // Fehlermeldung, wenn Exhibition nicht gefunden wurde
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

// getestet: geht auch
export const showAllExhibitions = async (req: Request, res: Response) => {
  try {
    const exhibitions = await Exhibition.findAll({
      where: { isDeleted: false },
    });

    return res.status(200).json(exhibitions);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler" });
  }
}; // den brauchen wir für das select- oder suchfeld in artwork

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
      // error: e instanceof Error ? e.message : e,
    });
  }
};

// noch testen?
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

    // Fehlermeldung, wenn Exhibition nicht gefunden wurde
    if (!exhibition) {
      await t.rollback();

      return res
        .status(404)
        .json({ msg: "Die Exhibition wurde nicht gefunden." });
    }

    // die zur Exhibition gehörige Translation suchen
    const translation = await ExhibitionTranslation.findOne({
      where: { exhibitionId, languageCode }, // languageCode unbedingt drin lassen, weil Bestandteil des PrimaryKeys
      transaction: t,
    });

    // Rollback der Transaction und Fehler, falls Translation nicht gefunden
    if (!translation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die ExhibitionTranslation wurde nicht gefunden.",
      });
    }

    // diese Felder können nun upgedatet werden // ggfs. hier noch weitere Felder in Silver-Edition hinzufügen
    await exhibition.update(
      {
        coverImageId,
        startDate,
        endDate,
        lastEditedBy: req.user!.id,
      },
      { transaction: t }
    );

    // die Daten in der ExhibitionTranslation aktualisieren
    await translation.update(
      { title, subtitle, location, description },
      { transaction: t }
    );

    // wenn alles erfolgreich war, Transaction durchführen
    await t.commit();

    // aktualisierte Datensätze zurückgeben
    return res.status(200).json({ exhibition, translation });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht upgedatet werden.",
    });
  }
};

// getestet: klappt!
export const archiveExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    // exhibition ID aus den Params holen
    const { exhibitionId } = req.params;

    // die noch nicht gelöschte Exhibition in der DB suchen
    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
    });

    // Fehler ausgeben, wenn keine Exhibition gefunden wurde
    if (!exhibition) {
      return res
        .status(404)
        .json({ msg: "Die Exhibition konnte nicht gefunden werden." });
    }

    // Status isArchived zu archiviert aktualisieren
    await exhibition.update({ isArchived: true, lastEditedBy: req.user!.id });

    // aktualisierten Datensatz zurückgeben
    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht archiviert werden.",
    });
  }
};

// getestet: klappt!
export const deleteExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    // wieder exhibition ID aus den Params holen
    const { exhibitionId } = req.params;

    // die nicht gelöschte Exhibition in der DB suchen
    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
    });

    // wieder Fehler ausgeben, wenn keine Exhibition gefunden wurde
    if (!exhibition) {
      return res
        .status(404)
        .json({ msg: "Die Exhibition konnte nicht gefunden werden." });
    }

    // Status isDeleted zu true ändern
    await exhibition.update({ isDeleted: true, lastEditedBy: req.user!.id });

    // aktualisierten Datensatz zurückgeben
    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht als gelöscht markiert werden.",
    });
  }
};
