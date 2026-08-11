import type { Request, Response } from "express";
import { Exhibition } from "../models";
import { ExhibitionTranslation } from "../models";
import db from "../lib/db";

// getestet: funktioniert
export const showOneExhibition = async (
  req: Request<{ exhibitionId: string }>, // für TS: Parameter req mit einem generischen Request-Typ typisiert, dessen Type Argument ein Object Type Literal ist
  res: Response
) => {
  try {
    // Exhibition ID aus der URL holen
    const { exhibitionId } = req.params;

    // Exhibition über ID in DB suchen
    const exhibition = await Exhibition.findByPk(exhibitionId);

    // Fehlermeldung, wenn Exhibition nicht gefunden wurde
    if (!exhibition) {
      return res.status(404).json({ msg: "Exhibition nicht gefunden." });
    }

    // Exhibition zurückgeben, wenn efolgreich
    return res.status(200).json(exhibition);
  } catch (e) {
    return res.status(500).json({ msg: "Server-Fehler" });
  }
};

// getestet: geht auch
export const showAllExhibitions = async (req: Request, res: Response) => {
  try {
    const exhibitions = await Exhibition.findAll({
      where: { isDeleted: false },
    });

    // da findAll() ein Array zurückgibt, über die Länge des Arrays prüfen
    if (exhibitions.length === 0) {
      return res
        .status(404)
        .json({ msg: "Es wurde keine einzige Ausstellung gefunden." });
    }

    return res.status(200).json(exhibitions);
  } catch (e) {
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
        createdBy: req.user?.userId, // hier noch austauschen, sobald auth-middleware implementiert ist // hier später dann wahrscheinlich req.user.id, aber schauen, wie middleware gebaut ist
        lastEditedBy: null, // Info kommt vom BE
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

// noch testen!
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

    // Exhibition über ID in DB suchen
    const exhibition = await Exhibition.findByPk(exhibitionId, {
      transaction: t,
    });

    // Fehlermeldung, wenn Exhibition nicht gefunden wurde
    if (!exhibition) {
      await t.rollback();

      return res
        .status(404)
        .json({ msg: "Die Exhibition wurde nicht gefunden." });
    }

    // diese Felder können nun upgedatet werden // ggfs. hier noch weitere Felder in Silver-Edition hinzufügen
    await exhibition.update(
      {
        coverImageId,
        startDate,
        endDate,
      },
      { transaction: t }
    );

    // die zur Exhibition gehörige Translation suchen
    const translation = await ExhibitionTranslation.findOne({
      where: { exhibitionId, languageCode },
      transaction: t,
    });

    // Rollback der Transaction und Fehler, falls Translation nicht gefunden
    if (!translation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die ExhibitionTranslation wurde nicht gefunden.",
      });
    }

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

    // mit ID aus den Params die Exhibition in der DB suchen
    const exhibition = await Exhibition.findByPk(exhibitionId);

    // Fehler ausgeben, wenn keine Exhibition gefunden wurde
    if (!exhibition) {
      return res
        .status(404)
        .json({ msg: "Die Exhibition konnte nicht gefunden werden." });
    }

    // Status isArchived zu archiviert aktualisieren
    await exhibition.update({ isArchived: true });

    // aktualisierten Datensatz zurückgeben
    return res.status(200).json(exhibition);
  } catch (e) {
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

    // mit ID aus den Params die Exhibition in der DB suchen
    const exhibition = await Exhibition.findByPk(exhibitionId);

    // wieder Fehler ausgeben, wenn keine Exhibition gefunden wurde
    if (!exhibition) {
      return res
        .status(404)
        .json({ msg: "Die Exhibition konnte nicht gefunden werden." });
    }

    // die jeweilige Exhibition löschen
    // await exhibition.destroy(); // doch nicht, das wäre ein Hard Delete, erledigen wir aber irgendwann mit CronJob

    // Status isDeleted zu true ändern
    await exhibition.update({ isDeleted: true });

    // aktualisierten Datensatz zurückgeben
    return res.status(200).json(exhibition);
  } catch (e) {
    return res.status(500).json({
      msg: "Die Exhibition konnte nicht mit dem Status gelöscht versehen werden.",
    });
  }
};
