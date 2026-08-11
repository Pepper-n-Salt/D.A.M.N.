import type { Request, Response } from "express";

export const createArtworkTranslation = async (req: Request, res: Response) => {
  try {
    return res.status(201).json({
      msg: "ArtworkTranslation create funktioniert.",
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

export const updateArtworkTranslation = async (req: Request, res: Response) => {
  try {
  } catch (e) {}
};
