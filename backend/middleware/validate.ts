import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

export const validateBody = <T>(schema: ZodType<T>) => {
  // hier ein Generic
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body); // safeParse wirft keine Fehler im Gegensatz zu parse(), sondern gibt ein Ergebnisobjekt aus

    if (!result.success) {
      return res.status(400).json({
        msg: "Ungültige Eingabedaten.",
        errors: result.error.issues,
      });
    }

    req.body = result.data;

    next();
  };
};

// Record ist fest eingebauter Utility Type von TS
export const validateParams = <T extends Record<string, string>>(
  schema: ZodType<T>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("PARAMS IN VALIDATOR:", req.params);
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        msg: "Ungültige Parameter.",
        errors: result.error.issues,
      });
    }

    req.params = result.data;

    next();
  };
};
