import bcrypt from "bcrypt";
import crypto from "node:crypto";
import type { Request, Response } from "express";
import User from "../models/User.js";
import type { AuthenticatedRequest } from "../middleware/checkAuth.ts";

const safeUserFields = [
  "id",
  "email",
  "firstName",
  "lastName",
  "organisationId",
  "role",
];

const sanitizeUser = (user: User) => {
  return safeUserFields.reduce(
    (acc, key) => {
      // @ts-expect-error safe mapping
      acc[key] = user[key];
      return acc;
    },
    {} as Record<string, unknown>
  );
};

export const showAllUsers = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const organisationId = authReq.user?.organisationId;

    if (!organisationId) {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    const users = await User.findAll({
      where: { organisationId },
      attributes: safeUserFields,
    });

    return res.json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

export const showUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const organisationId = authReq.user?.organisationId;
    const { userId } = req.params as { userId: string };

    if (!organisationId) {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    const user = await User.findByPk(userId, { attributes: safeUserFields });

    if (!user || user.organisationId !== organisationId) {
      return res.status(403).json({ msg: "Zugriff verweigert." });
    }

    return res.json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const organisationId = authReq.user?.organisationId;
    const role = authReq.user?.role;
    const { email, password, firstName, lastName, userRole } = req.body;

    if (role !== "admin" && role !== "super") {
      return res.status(403).json({ msg: "Admin-Rechte erforderlich." });
    }

    if (!email || !password || !firstName || !lastName) {
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
    const newUser = await User.create({
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      organisationId,
      role: userRole === "admin" ? "admin" : "user",
    });

    return res.status(201).json({ user: sanitizeUser(newUser) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const organisationId = authReq.user?.organisationId;
    const role = authReq.user?.role;
    const currentUserId = authReq.user?.userId;
    const { userId } = req.params as { userId: string };

    if (!organisationId || !currentUserId) {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    const user = await User.findByPk(userId);

    if (!user || user.organisationId !== organisationId) {
      return res.status(403).json({ msg: "Zugriff verweigert." });
    }

    const isSelf = currentUserId === userId;

    if (!isSelf && role !== "admin" && role !== "super") {
      return res.status(403).json({ msg: "Admin-Rechte erforderlich." });
    }

    const { email, password, firstName, lastName, userRole } = req.body;

    if (email) {
      user.email = email.toLowerCase();
    }

    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    if (userRole && (role === "admin" || role === "super")) {
      user.role = userRole === "admin" ? "admin" : "user";
    }

    await user.save();

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const organisationId = authReq.user?.organisationId;
    const role = authReq.user?.role;
    const { userId } = req.params as { userId: string };

    if (role !== "admin" && role !== "super") {
      return res.status(403).json({ msg: "Admin-Rechte erforderlich." });
    }

    const user = await User.findByPk(userId);

    if (!user || user.organisationId !== organisationId) {
      return res.status(403).json({ msg: "Zugriff verweigert." });
    }

    await user.destroy();

    return res.status(200).json({ msg: "Benutzer:in gelöscht." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};
