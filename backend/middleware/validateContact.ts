import type { Request, Response, NextFunction } from "express";

export default function validateContact(
  req: Request,

  res: Response,

  next: NextFunction
) {
  const { name, email, message } = req.body;

  /*
        Pflichtfelder prüfen
    */

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,

      message: "Please fill in all fields.",
    });
  }

  /*
        E-Mail Format prüfen
    */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,

      message: "Invalid email address.",
    });
  }

  /*
        Schutz gegen riesige Nachrichten
    */

  if (message.length > 2000) {
    return res.status(400).json({
      success: false,

      message: "Message is too long.",
    });
  }

  next();
}
