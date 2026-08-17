import type { Request, Response, NextFunction } from "express";

export const requireSuperUser = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (!req.user) {
    return res.status(401).json({
      msg: "Nicht eingeloggt!",
    });
  }

  if (req.user.role !== "super") {
    return res.status(403).json({
      msg: "Keine Berechtigung.",
    });
  }

  next();
};
