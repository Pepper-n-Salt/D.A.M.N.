import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Das JWT_SECRET fehlt!");
}

const cookieOptions = {
  httpOnly: true,
  sameSite:
    process.env.NODE_ENV === "production"
      ? ("none" as const)
      : ("lax" as const),
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

// getestet: klappt
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, organisationId } = req.body;

    if (!email || !password || !firstName || !lastName || !organisationId) {
      return res
        .status(400)
        .json({ msg: "Alle Felder müssen ausgefüllt sein." });
    }

    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Diese E-Mail ist bereits vergeben." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      organisationId,
      role: "user",
    });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      msg: "Registrierung erfolgreich.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organisationId: user.organisationId,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// getestet: klappt!
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Bitte E-Mail und Passwort angeben." });
    }

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ msg: "Ungültige Anmeldedaten." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ msg: "Ungültige Anmeldedaten." });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, cookieOptions);

    return res.json({
      msg: "Login erfolgreich.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organisationId: user.organisationId,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

// getestet: klappt!
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ msg: "Logout erfolgreich." });
};

// getestet: klappt!
export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(401).json({ msg: "Benutzer:in nicht gefunden." });
    }

    return res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      organisationId: user.organisationId,
      role: user.role,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};
