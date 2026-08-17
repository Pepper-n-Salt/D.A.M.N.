import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Das JWT_SECRET fehlt!");
}

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = (req as Request & { cookies?: Record<string, string> })
      .cookies?.token;

    if (!token) {
      return res.status(401).json({ msg: "Nicht eingeloggt!" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({ msg: "Ungültiger Token." });
    }

    req.user = {
      id: user.id,
      organisationId: user.organisationId,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ msg: "Der Token ist ungültig!" });
  }
};
