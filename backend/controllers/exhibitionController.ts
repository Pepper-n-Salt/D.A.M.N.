import crypto from "node:crypto";

import type { Request, Response } from "express";
import { Exhibition, ExhibitionTranslation, User, Media } from "../models";
import db from "../lib/db";
import { processExhibitionTranslation } from "../services/exhibitionMistralService.js";

const findAccessibleExhibition = async (
  exhibitionId: string,
  user: NonNullable<Request["user"]>,
  transaction?: any
) => {
  const isSuper = user.role === "super";

  return Exhibition.findOne({
    where: {
      id: exhibitionId,
      isDeleted: false,
    },
    include: [
      {
        model: User,
        as: "creator",
        ...(isSuper
          ? {}
          : {
              where: {
                organisationId: user.organisationId,
              },
            }),
      },
    ],
    ...(transaction ? { transaction } : {}),
  });
};

// Alle nicht gelöschten Exhibitions abrufen
export const showAllExhibitions = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    const { languageCode } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const isSuper = req.user.role === "super";

    if (!isSuper && !req.user.organisationId) {
      return res.status(403).json({
        msg: "Keine Organisation zugeordnet.",
      });
    }

    const exhibitions = await Exhibition.findAll({
      where: {
        isDeleted: false,
      },
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

          /*
            SUPER:
            sieht alle Exhibitions.

            ADMIN / USER:
            nur Exhibitions, deren Creator
            derselben Organisation angehört.
          */
          ...(isSuper
            ? {}
            : {
                where: {
                  organisationId: req.user.organisationId,
                },
              }),

          attributes: ["id", "firstName", "lastName", "organisationId"],
        },
        {
          model: Media,
          attributes: ["id", "fileUrl"],
        },
      ],
    });

    const result = exhibitions.map((exh) => {
      const translation = exh.ExhibitionTranslations?.[0];

      return {
        id: exh.id,
        coverImageId: exh.coverImageId,
        fileUrl: exh.Medium?.fileUrl ?? null,
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

// Einzelne, nicht gelöschte Exhibition abrufen
export const showOneExhibition = async (
  req: Request<{ exhibitionId: string; languageCode: string }>,
  res: Response
) => {
  try {
    const { exhibitionId, languageCode } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const isSuper = req.user.role === "super";

    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
      include: [
        {
          model: ExhibitionTranslation,
          where: {
            languageCode,
          },
        },
        {
          model: Media,
        },
        {
          model: User,
          as: "creator",

          ...(isSuper
            ? {}
            : {
                where: {
                  organisationId: req.user.organisationId,
                },
              }),
        },
      ],
    });

    if (!exhibition) {
      return res.status(404).json({
        msg: "Exhibition nicht gefunden oder kein Zugriff.",
      });
    }

    const translation = exhibition.ExhibitionTranslations?.[0];

    if (!translation) {
      return res.status(404).json({
        msg: "Die Übersetzung der Exhibition wurde nicht gefunden.",
      });
    }

    return res.status(200).json({
      id: exhibition.id,
      coverImageId: exhibition.coverImageId,
      fileUrl: exhibition.Medium?.fileUrl,
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
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler",
    });
  }
};

// Öffentliche Exhibition
//
// Diese Route bleibt absichtlich ohne Organisationsprüfung.
export const showPublicExhibition = async (
  req: Request<{ exhibitionId: string; languageCode: string }>,
  res: Response
) => {
  try {
    const { exhibitionId, languageCode } = req.params;

    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: false,
      },
      include: [
        {
          model: ExhibitionTranslation,
          where: {
            languageCode,
          },
        },
        {
          model: Media,
        },
      ],
    });

    if (!exhibition) {
      return res.status(404).json({
        msg: "Exhibition nicht gefunden.",
      });
    }

    const translation = exhibition.ExhibitionTranslations?.[0];

    if (!translation) {
      return res.status(404).json({
        msg: "Die Übersetzung der Exhibition wurde nicht gefunden.",
      });
    }

    return res.status(200).json({
      id: exhibition.id,
      coverImageId: exhibition.coverImageId,
      fileUrl: exhibition.Medium?.fileUrl ?? null,
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
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

// Neue Exhibition inklusive der ersten Übersetzung erstellen
export const createExhibition = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

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
      Mistral prüft den Inhalt vor dem DB-Save.
    */

    const aiResult = await processExhibitionTranslation({
      title,
      subtitle,
      location,
      description,
    });

    if (aiResult.sourceLanguage !== languageCode) {
      return res.status(422).json({
        msg: "Die erkannte Sprache stimmt nicht mit der angegebenen Sprache überein.",

        aiValidation: {
          sourceLanguage: aiResult.sourceLanguage,
          expectedLanguage: languageCode,
        },
      });
    }

    const t = await db.transaction();

    try {
      const exhibition = await Exhibition.create(
        {
          id: crypto.randomUUID(),
          coverImageId,
          startDate,
          endDate,
          createdBy: req.user.id,
          lastEditedBy: req.user.id,
          isArchived: false,
          isDeleted: false,
        },
        { transaction: t }
      );

      const translation = await ExhibitionTranslation.create(
        {
          exhibitionId: exhibition.id,
          languageCode,
          title: aiResult.corrected.title,
          subtitle: aiResult.corrected.subtitle,
          location: aiResult.corrected.location,
          description: aiResult.corrected.description,
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

// Exhibition und Übersetzung aktualisieren
export const updateExhibition = async (
  req: Request<{ exhibitionId: string; languageCode: string }>,
  res: Response
) => {
  const t = await db.transaction();

  try {
    const { exhibitionId, languageCode } = req.params;

    if (!req.user) {
      await t.rollback();

      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const {
      coverImageId,
      startDate,
      endDate,
      title,
      subtitle,
      location,
      description,
    } = req.body;

    const exhibition = await findAccessibleExhibition(
      exhibitionId,
      req.user,
      t
    );

    if (!exhibition) {
      await t.rollback();

      return res.status(404).json({
        msg: "Die Exhibition wurde nicht gefunden oder du hast keinen Zugriff.",
      });
    }

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
        msg: "Die ExhibitionTranslation wurde nicht gefunden.",
      });
    }

    await exhibition.update(
      {
        coverImageId,
        startDate,
        endDate,
        lastEditedBy: req.user.id,
      },
      { transaction: t }
    );

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

    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht aktualisiert werden.",
    });
  }
};

// Exhibition archivieren
export const archiveExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    const { exhibitionId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const exhibition = await findAccessibleExhibition(exhibitionId, req.user);

    if (!exhibition) {
      return res.status(404).json({
        msg: "Die Exhibition konnte nicht gefunden werden oder du hast keinen Zugriff.",
      });
    }

    await exhibition.update({
      isArchived: true,
      lastEditedBy: req.user.id,
    });

    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht archiviert werden.",
    });
  }
};

// Exhibition per Soft Delete löschen
export const deleteExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    const { exhibitionId } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const exhibition = await findAccessibleExhibition(exhibitionId, req.user);

    if (!exhibition) {
      return res.status(404).json({
        msg: "Die Exhibition konnte nicht gefunden werden oder du hast keinen Zugriff.",
      });
    }

    await exhibition.update({
      isDeleted: true,
      lastEditedBy: req.user.id,
    });

    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht als gelöscht markiert werden.",
    });
  }
};

// Soft-deletete Exhibitions anzeigen
// Nur Superuser
export const showDeletedExhibitions = async (
  req: Request<{ languageCode: string }>,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    if (req.user.role !== "super") {
      return res.status(403).json({
        msg: "Nur Superuser:innen haben Zugriff.",
      });
    }

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

// Exhibition wiederherstellen
// Nur Superuser
export const restoreExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    if (req.user.role !== "super") {
      return res.status(403).json({
        msg: "Nur Superuser:innen dürfen Exhibitions wiederherstellen.",
      });
    }

    const { exhibitionId } = req.params;

    const exhibition = await Exhibition.findOne({
      where: {
        id: exhibitionId,
        isDeleted: true,
      },
    });

    if (!exhibition) {
      return res.status(404).json({
        msg: "Die gelöschte Exhibition konnte nicht gefunden werden.",
      });
    }

    await exhibition.update({
      isDeleted: false,
      lastEditedBy: req.user.id,
    });

    return res.status(200).json(exhibition);
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht wiederhergestellt werden.",
    });
  }
};

// Exhibition als Screen markieren
export const setExhibitionScreen = async (
  req: Request<{ exhibitionId: string; languageCode: string }>,
  res: Response
) => {
  try {
    const { exhibitionId, languageCode } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const exhibition = await findAccessibleExhibition(exhibitionId, req.user);

    if (!exhibition) {
      return res.status(404).json({
        msg: "Die Exhibition wurde nicht gefunden oder du hast keinen Zugriff.",
      });
    }

    const translation = await ExhibitionTranslation.findOne({
      where: {
        exhibitionId,
        languageCode,
      },
    });

    if (!translation) {
      return res.status(404).json({
        message: "Die Exhibition Translation wurde nicht gefunden.",
      });
    }

    await translation.update({
      isScreen: true,
    });

    return res.status(200).json({
      msg: "Die Exhibition wurde als Screen markiert.",
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Diese Exhibition konnte nicht als Screen markiert werden.",
    });
  }
};

// Exhibition aus Screens entfernen
export const removeExhibitionScreen = async (
  req: Request<{ exhibitionId: string; languageCode: string }>,
  res: Response
) => {
  try {
    const { exhibitionId, languageCode } = req.params;

    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const exhibition = await findAccessibleExhibition(exhibitionId, req.user);

    if (!exhibition) {
      return res.status(404).json({
        msg: "Die Exhibition wurde nicht gefunden oder du hast keinen Zugriff.",
      });
    }

    const translation = await ExhibitionTranslation.findOne({
      where: {
        exhibitionId,
        languageCode,
      },
    });

    if (!translation) {
      return res.status(404).json({
        message: "Die Exhibition Translation wurde nicht gefunden.",
      });
    }

    await translation.update({
      isScreen: false,
    });

    return res.status(200).json({
      msg: "Die Exhibition konnte vom Screen entfernt werden.",
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Die Exhibition konnte nicht als Screen entfernt werden.",
    });
  }
};
