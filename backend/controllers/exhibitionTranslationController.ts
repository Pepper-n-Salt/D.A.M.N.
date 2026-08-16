import type { Request, Response } from "express";
import db from "../lib/db";
import { Exhibition, ExhibitionTranslation } from "../models";
import { processExhibitionTranslation } from "../services/exhibitionMistralService.js";

/*
  --------------------------------------------------------------------------
  Translation Preview
  --------------------------------------------------------------------------

  Wird aufgerufen, wenn der User auf "Translate" klickt.

  Wichtig:
  Hier wird NICHT gespeichert.

  Wir:
  1. suchen die Exhibition
  2. holen ihre vorhandene Ausgangs-Translation
  3. schicken die Texte an Mistral
  4. geben die Übersetzung an das Frontend zurück

  Das Frontend füllt damit anschließend das zweite Formular.
*/

export const previewExhibitionTranslation = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    const { exhibitionId } = req.params;
    const { targetLanguage } = req.body;

    /*
      Exhibition suchen.
    */

    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },

      include: [
        {
          model: ExhibitionTranslation,
        },
      ],
    });

    if (!exhibition) {
      return res.status(404).json({
        msg: "Die Exhibition wurde nicht gefunden.",
      });
    }

    /*
      Wir suchen die Translation, die als Ausgangssprache
      verwendet werden soll.

      Da deine Exhibition mehrere Übersetzungen haben kann,
      sollten wir langfristig sourceLanguage ebenfalls vom
      Frontend übergeben.

      Für den aktuellen Aufbau nehmen wir die erste vorhandene
      Translation.
    */

    const sourceTranslation = exhibition.ExhibitionTranslations?.[0];

    if (!sourceTranslation) {
      return res.status(404).json({
        msg: "Es wurde keine Ausgangsübersetzung gefunden.",
      });
    }

    /*
      Wenn die gewünschte Sprache bereits existiert,
      muss Mistral nichts übersetzen.
    */

    const existingTranslation = exhibition.ExhibitionTranslations?.find(
      (translation) => translation.languageCode === targetLanguage
    );

    if (existingTranslation) {
      return res.status(200).json({
        exhibitionId: exhibition.id,
        languageCode: existingTranslation.languageCode,

        title: existingTranslation.title,
        subtitle: existingTranslation.subtitle,
        location: existingTranslation.location,
        description: existingTranslation.description,

        alreadyExists: true,
        aiGenerated: existingTranslation.aiGenerated,
      });
    }

    /*
      Mistral verarbeiten lassen.

      Wichtig:
      processExhibitionTranslation schreibt NICHT in die DB.
    */

    const aiResult = await processExhibitionTranslation({
      title: sourceTranslation.title,
      subtitle: sourceTranslation.subtitle,
      location: sourceTranslation.location,
      description: sourceTranslation.description,
    });

    /*
      Wir stellen sicher, dass Mistral tatsächlich die Sprache
      geliefert hat, die das Frontend angefordert hat.

      Dadurch verhindern wir beispielsweise eine unerwartete
      DE -> DE Antwort.
    */

    if (aiResult.targetLanguage !== targetLanguage) {
      return res.status(502).json({
        msg: "Mistral hat nicht in die gewünschte Sprache übersetzt.",
      });
    }

    /*
      Hier speichern wir NICHT.

      Das Frontend erhält nur die Translation-Preview.
    */

    return res.status(200).json({
      exhibitionId: exhibition.id,
      languageCode: aiResult.targetLanguage,

      title: aiResult.translation.title,
      subtitle: aiResult.translation.subtitle,
      location: aiResult.translation.location,
      description: aiResult.translation.description,

      alreadyExists: false,
      aiGenerated: true,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht übersetzt werden.",
    });
  }
};

// weitere Übersetzung für eine bestehende Exhibition anlegen
// getestet: klappt
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

// diese weitere Übersetzung für eine bereits bestehende Exhibition editieren
// getestet: klappt auch!
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
