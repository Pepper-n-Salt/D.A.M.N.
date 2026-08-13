import type { Request, Response } from "express";
import db from "../lib/db";
import { Exhibition, ExhibitionTranslation } from "../models";

// weitere Übersetzung für eine bestehende Exhibition anlegen
export const createExhibitionTranslation = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  const t = await db.transaction();
  try {
    const { exhibitionId } = req.params;

    const { languageCode, title, subtitle, location, description } = req.body;

    // überprüfen, dass die Exhibition existiert und nicht gelöscht wurde
    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
      transaction: t,
    });

    if (!exhibition) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die Exhibition wurde nicht gefunden.",
      });
    }

    // überprüfen, ob diese Sprache bereits existiert
    const existingTranslation = await ExhibitionTranslation.findOne({
      where: {
        exhibitionId,
        languageCode,
      },
      transaction: t,
    });

    if (existingTranslation) {
      await t.rollback();

      return res.status(400).json({
        msg: "Für diese Exhibition existiert bereits eine Übersetzung in dieser Sprache.",
      });
    }

    const translation = await ExhibitionTranslation.create(
      {
        exhibitionId,
        languageCode,
        title,
        subtitle,
        location,
        description,
        aiGenerated: false,
        isScreen: false,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(201).json({
      exhibitionId: translation.exhibitionId,
      languageCode: translation.languageCode,
      title: translation.title,
      subtitle: translation.subtitle,
      location: translation.location,
      description: translation.description,
      // aiGenerated: translation.aiGenerated,
      isScreen: translation.isScreen,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die ExhibitionTranslation konnte nicht angelegt werden.",
    });
  }
};

export const updateExhibitionTranslation = async (
  req: Request<{
    exhibitionId: string;
    languageCode: string;
  }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { exhibitionId, languageCode } = req.params;

    const { title, subtitle, location, description } = req.body;

    // überprüfen, dass die Exhibition existiert und nicht gelöscht wurde
    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
      transaction: t,
    });

    if (!exhibition) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die Exhibition wurde nicht gefunden.",
      });
    }

    // Translation über den kombinierten Primary Key suchen
    const translation = await ExhibitionTranslation.findOne({
      where: {
        exhibitionId,
        languageCode,
      },
      transaction: t,
    });

    if (!translation) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die Exhibition Translation wurde nicht gefunden.",
      });
    }

    await translation.update(
      {
        title,
        subtitle,
        location,
        description,
      },
      { transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      exhibitionId: translation.exhibitionId,
      languageCode: translation.languageCode,
      title: translation.title,
      subtitle: translation.subtitle,
      location: translation.location,
      description: translation.description,
      // aiGenerated: translation.aiGenerated,
      isScreen: translation.isScreen,
    });
  } catch (e) {
    await t.rollback();

    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition Translation konnte nicht aktualisiert werden.",
    });
  }
};
