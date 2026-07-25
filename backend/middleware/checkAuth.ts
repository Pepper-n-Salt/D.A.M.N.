import type { Request, Response, NextFunction } from "express";

export const checkAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // hier logik reinschreiebn
  next();
};
