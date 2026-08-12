import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        msg: "Ungültige Eingabedaten.",
        errors: result.error.flatten(),
      });
    }

    req.body = result.data;

    next();
  };
};
