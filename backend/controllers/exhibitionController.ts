import type { Request, Response } from "express";
import { Exhibition } from "../models";
import { ExhibitionTranslation } from "../models";

// funktioniert
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
      return res.status(404).json({ msg: "Exhibition not found." });
    }

    // Exhibition zurückgeben, wenn efolgreich
    return res.status(200).json(exhibition);
  } catch (e) {
    return res.status(500).json({ msg: "Server error." });
  }
};

// geht auch
export const showAllExhibitions = async (req: Request, res: Response) => {
  try {
    const exhibitions = await Exhibition.findAll({
      where: { isDeleted: false },
    });

    // da findAll() ein Array zurückgibt, über die Länge des Arrays prüfen
    if (exhibitions.length === 0) {
      return res.status(404).json({ msg: "Not a single exhibition found." });
    }

    return res.status(200).json(exhibitions);
  } catch (e) {
    return res.status(500).json({ msg: "Server error." });
  }
}; // den brauchen wir für das select- oder suchfeld in artwork

// mit testdaten überprüft, klappt!
export const createExhibition = async (req: Request, res: Response) => {
  try {
    const {
      coverImageId,
      startDate,
      endDate,
      // openingEvent,
      // specialEvent,
      // closingEvent,
      // primaryColor,
      // secondaryColor,
      // backgroundColor,
      // textColor,
      // headlineFont,
      // textFont,
      // roundness,
      languageCode,
      title,
      subtitle,
      location,
      description,
      // slug,
    } = req.body;

    // aus Exhibition.create() und aus ExhibitionTranslation.create() in einem späteren Schritt eine Transaction machen, also nur wenn beides geklappt hat, dann wird gespeichert!
    const exhibition = await Exhibition.create({
      id: crypto.randomUUID(),
      coverImageId,
      startDate,
      endDate,
      // openingEvent,
      // specialEvent,
      // closingEvent,
      createdBy: "274da430-60da-4903-b6ac-bf37f1d2853d", // testweise user-id imke eingesetzt // hier noch austauschen, sobald auth-middleware implementiert ist // hier später dann wahrscheinlich req.user.id, aber schauen, wie middleware gebaut ist
      lastEditedBy: null, // Info kommt vom BE
      isArchived: false, // Info kommt vom BE
      isDeleted: false, // Info kommt vom BE
      // primaryColor,
      // secondaryColor,
      // backgroundColor,
      // textColor,
      // headlineFont,
      // textFont,
      // roundness,
    });

    const translation = await ExhibitionTranslation.create({
      exhibitionId: exhibition.id,
      languageCode,
      title,
      subtitle,
      location,
      description,
      // slug,
      aiGenerated: false, // kommt irgendwann vom BE
      isScreen: false, // hier genauso: Info kommt irgendwann vom BE
    });

    return res.status(201).json({
      exhibition,
      translation,
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Server error.",
    });
  }
};

export const updateExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    // Exhibition ID wieder aus der URL holen
    const { exhibitionId } = req.params;

    // Exhibition über ID in DB suchen
    const exhibition = await Exhibition.findByPk(exhibitionId);

    // Fehlermeldung, wenn Exhibition nicht gefunden wurde
    if (!exhibition) {
      return res.status(404).json({ msg: "Exhibition not found." });
    }

    // Formularfelder aus req.body holen
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

    // hier legen wir alle Felder fest, die upgedatet werden können // ggfs. noch weitere Felder in Silver-Edition hinzufügen
    await exhibition.update({
      coverImageId,
      startDate,
      endDate,
      languageCode,
      title,
      subtitle,
      location,
      description,
    });

    // aktualisierten Datensatz zurückgeben
    return res.status(200).json(exhibition);
  } catch (e) {}
};

export const archiveExhibition = async (
  req: Request<{ exhibitionId: string }>,
  res: Response
) => {
  try {
    // exhibition ID aus den Params holen
    const { exhibitionId } = req.params;

    // damit die Exhibition in der DB suchen
    const exhibition = await Exhibition.findByPk(exhibitionId);

    if (!exhibition) {
      return res.status(404).json({ msg: "Exhibition not found." });
    }

    // isArchived updaten
    await exhibition.update({ isArchived: true });

    // aktualisierten Datensatz zurückgeben
    return res.status(200).json(exhibition);
  } catch (e) {}
};

export const deleteExhibition = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
