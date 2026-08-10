import type { Request, Response } from "express";
import { Exhibition } from "../models";
import { ExhibitionTranslation } from "../models";

// funktioniert
export const showOneExhibition = async (
  req: Request<{ exhibitionId: string }>,
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

// mit testdaten überprüft:
// {
//   "startDate": "2026-09-01",
//   "endDate": "2026-10-15",
//   "openingEvent": "Vernissage",
//   "specialEvent": "Artist Talk am 20. September",
//   "closingEvent": "Finissage",
//   "primaryColor": "#1A1A1A",
//   "secondaryColor": "#D4AF37",
//   "backgroundColor": "#F5F2EA",
//   "textColor": "#1A1A1A",
//   "headlineFont": "Helvetica",
//   "textFont": "Arial",
//   "roundness": "medium",
//   "languageCode": "de",
//   "title": "Zwischen Licht und Raum",
//   "subtitle": "Zeitgenössische Positionen",
//   "location": "Leipzig",
//   "description": "Eine Ausstellung mit zeitgenössischen Positionen zur Beziehung zwischen Licht, Raum und Wahrnehmung.",
//   "slug": "zwischen-licht-und-raum"
// }
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

export const updateExhibition = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const archiveExhibition = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};

export const deleteExhibition = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
