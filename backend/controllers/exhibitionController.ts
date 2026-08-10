import type { Request, Response } from "express";
import { Exhibition } from "../models";

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

export const createExhibition = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
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
