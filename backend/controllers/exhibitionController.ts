import type { Request, Response } from "express";
import { Exhibition, ExhibitionTranslation, User } from "../models";
import db from "../lib/db";
import { processExhibitionTranslation } from "../services/exhibitionMistralService.js";

// Alle nicht gelöschten Exhibitions abrufen
// getestet: klappt!
export const showAllExhibitions = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    const exhibitions = await Exhibition.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: ExhibitionTranslation,
          where: {
            languageCode,
          },
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    const result = exhibitions.map((exh) => {
      const translation = exh.ExhibitionTranslations?.[0];

      return {
        id: exh.id,
        coverImageId: exh.coverImageId,
        startDate: exh.startDate,
        endDate: exh.endDate,
        createdBy: exh.createdBy,
        createdByName: exh.creator
          ? `${exh.creator.firstName} ${exh.creator.lastName}`
          : null,
        lastEditedBy: exh.lastEditedBy,
        isArchived: exh.isArchived,
        isDeleted: exh.isDeleted,
        backgroundColor: exh.backgroundColor,

        languageCode: translation?.languageCode,
        title: translation?.title,
        subtitle: translation?.subtitle,
        location: translation?.location,
        description: translation?.description,
        // aiGenerated: translation?.aiGenerated,
        isScreen: translation?.isScreen,
      };
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// Einzelne, nicht gelöschte Exhibition abrufen
// getestet: klappt!
export const showOneExhibition = async (
  req: Request<{ exhibitionId: string; languageCode: string }>, // für TS: Parameter req mit einem generischen Request-Typ typisiert, dessen Type Argument ein Object Type Literal ist
  res: Response
) => {
  try {
    // Exhibition ID und LanguageCode aus der URL holen
    const { exhibitionId, languageCode } = req.params;

    // nicht gelöschte Exhibition über ID in DB suchen
    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
      include: [
        {
          model: ExhibitionTranslation,
          where: { languageCode },
        },
      ],
    });

    if (!exhibition) {
      return res.status(404).json({ msg: "Exhibition nicht gefunden." });
    }

    const translation = exhibition.ExhibitionTranslations?.[0];

    if (!translation) {
      return res
        .status(404)
        .json({ msg: "Die Übersetzung der Exhibition wurde nicht gefunden." });
    }

    // Exhibition- und Translation-Felder zurückgeben, wenn erfolgreich
    return res.status(200).json({
      id: exhibition.id,
      coverImageId: exhibition.coverImageId,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      createdBy: exhibition.createdBy,
      lastEditedBy: exhibition.lastEditedBy,
      isArchived: exhibition.isArchived,
      isDeleted: exhibition.isDeleted,
      backgroundColor: exhibition.backgroundColor,

      languageCode: translation?.languageCode,
      title: translation?.title,
      subtitle: translation?.subtitle,
      location: translation?.location,
      description: translation?.description,
      // aiGenerated: translation?.aiGenerated,
      isScreen: translation?.isScreen,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ msg: "Server-Fehler" });
  }
};

// Neue Exhibition inklusive der ersten Übersetzung erstellen
// getestet: klappt!
// export const createExhibition = async (req: Request, res: Response) => {
//   const t = await db.transaction();

//   try {
//     const {
//       coverImageId,
//       startDate,
//       endDate,
//       languageCode,
//       title,
//       subtitle,
//       location,
//       description,
//     } = req.body;

//     // hier ggfs. in der Silver-Edition weitere Felder hinzufügen
//     const exhibition = await Exhibition.create(
//       {
//         id: crypto.randomUUID(),
//         coverImageId,
//         startDate,
//         endDate,
//         createdBy: req.user!.id,
//         lastEditedBy: req.user!.id,
//         isArchived: false, // Info kommt vom BE
//         isDeleted: false, // Info kommt vom BE
//       },
//       { transaction: t }
//     );

//     const translation = await ExhibitionTranslation.create(
//       {
//         exhibitionId: exhibition.id, // Info kommt vom BE
//         languageCode,
//         title,
//         subtitle,
//         location,
//         description,
//         aiGenerated: false, // Info kommt vom BE
//         isScreen: false, // Info kommt vom BE
//       },
//       { transaction: t }
//     );

//     await t.commit();

//     return res.status(201).json({
//       id: exhibition.id,
//       coverImageId: exhibition.coverImageId,
//       startDate: exhibition.startDate,
//       endDate: exhibition.endDate,
//       createdBy: exhibition.createdBy,
//       lastEditedBy: exhibition.lastEditedBy,
//       isArchived: exhibition.isArchived,
//       isDeleted: exhibition.isDeleted,
//       backgroundColor: exhibition.backgroundColor,

//       languageCode: translation.languageCode,
//       title: translation.title,
//       subtitle: translation.subtitle,
//       location: translation.location,
//       description: translation.description,
//       // aiGenerated: translation.aiGenerated,
//       isScreen: translation.isScreen,
//     });
//   } catch (e) {
//     await t.rollback();

//     console.error(e);

//     return res.status(500).json({
//       msg: "Server-Fehler.",
//     });
//   }
// };

// Neue Exhibition inklusive der ersten Übersetzung erstellen
export const createExhibition = async (req: Request, res: Response) => {
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

    /*
      ----------------------------------------------------------------------
      1. Mistral prüft den Inhalt VOR dem DB-Save
      ----------------------------------------------------------------------

      Der User hat den Datensatz eingegeben.

      Zod hat bereits die technischen Anforderungen geprüft.

      Jetzt prüft Mistral:
      - Sprache
      - Rechtschreibung
      - Grammatik
      - offensichtliche sprachliche Probleme

      Mistral schreibt hier noch NICHT in die DB.
    */

    const aiResult = await processExhibitionTranslation({
      title,
      subtitle,
      location,
      description,
    });

    /*
      ----------------------------------------------------------------------
      2. Prüfen, ob Mistral die erwartete Ausgangssprache erkannt hat
      ----------------------------------------------------------------------

      Dein aktuelles System unterstützt nur DE und EN.
    */

    if (aiResult.sourceLanguage !== languageCode) {
      return res.status(422).json({
        msg: "Die erkannte Sprache stimmt nicht mit der angegebenen Sprache überein.",

        aiValidation: {
          sourceLanguage: aiResult.sourceLanguage,
          expectedLanguage: languageCode,
        },
      });
    }

    /*
      ----------------------------------------------------------------------
      3. DB-Transaktion erst NACH erfolgreicher Mistral-Prüfung
      ----------------------------------------------------------------------
    */

    const t = await db.transaction();

    try {
      const exhibition = await Exhibition.create(
        {
          id: crypto.randomUUID(),
          coverImageId,
          startDate,
          endDate,
          createdBy: req.user!.id,
          lastEditedBy: req.user!.id,
          isArchived: false,
          isDeleted: false,
        },
        { transaction: t }
      );

      const translation = await ExhibitionTranslation.create(
        {
          exhibitionId: exhibition.id,
          languageCode,

          /*
              Hier verwenden wir die korrigierte Version
              von Mistral.

              Dadurch wird nicht die möglicherweise fehlerhafte
              ursprüngliche Eingabe gespeichert.
            */
          title: aiResult.corrected.title,
          subtitle: aiResult.corrected.subtitle,
          location: aiResult.corrected.location,
          description: aiResult.corrected.description,

          /*
              Die Ausgangssprache wurde zwar von Mistral geprüft,
              aber nicht von Mistral als Übersetzung erzeugt.

              Deshalb bleibt aiGenerated false.
            */
          aiGenerated: false,

          isScreen: false,
        },
        { transaction: t }
      );

      await t.commit();

      return res.status(201).json({
        id: exhibition.id,
        coverImageId: exhibition.coverImageId,
        startDate: exhibition.startDate,
        endDate: exhibition.endDate,
        createdBy: exhibition.createdBy,
        lastEditedBy: exhibition.lastEditedBy,
        isArchived: exhibition.isArchived,
        isDeleted: exhibition.isDeleted,
        backgroundColor: exhibition.backgroundColor,

        languageCode: translation.languageCode,
        title: translation.title,
        subtitle: translation.subtitle,
        location: translation.location,
        description: translation.description,
        isScreen: translation.isScreen,
      });
    } catch (e) {
      await t.rollback();

      throw e;
    }
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht gespeichert werden.",
    });
  }
};

// Exhibition und die dazugehörige Übersetzung aktualisieren
// getestet: klappt!
export const updateExhibition = async (
  req: Request<{ exhibitionId: string; languageCode: string }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    // Exhibition ID wieder aus der URL holen
    const { exhibitionId, languageCode } = req.params;

    // Formularfelder aus dem FE holen // hier ggfs. in der Silver-Edition weitere Felder hinzufügen
    const {
      coverImageId,
      startDate,
      endDate,
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

    return res.status(200).json({
      id: exhibition.id,
      coverImageId: exhibition.coverImageId,
      startDate: exhibition.startDate,
      endDate: exhibition.endDate,
      createdBy: exhibition.createdBy,
      lastEditedBy: exhibition.lastEditedBy,
      isArchived: exhibition.isArchived,
      isDeleted: exhibition.isDeleted,
      backgroundColor: exhibition.backgroundColor,

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
export const showDeletedExhibitions = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    const exhibitions = await Exhibition.findAll({
      where: {
        isDeleted: true,
      },
      include: [
        {
          model: ExhibitionTranslation,
          where: {
            languageCode,
          },
        },
      ],
    });

    const result = exhibitions.map((exh) => {
      const translation = exh.ExhibitionTranslations?.[0];

      return {
        id: exh.id,
        coverImageId: exh.coverImageId,
        startDate: exh.startDate,
        endDate: exh.endDate,
        createdBy: exh.createdBy,
        lastEditedBy: exh.lastEditedBy,
        isArchived: exh.isArchived,
        isDeleted: exh.isDeleted,
        backgroundColor: exh.backgroundColor,

        languageCode: translation?.languageCode,
        title: translation?.title,
        subtitle: translation?.subtitle,
        location: translation?.location,
        description: translation?.description,
        isScreen: translation?.isScreen,
      };
    });

    return res.status(200).json(result);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};
