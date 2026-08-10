import bcrypt from "bcrypt";
import crypto from "node:crypto";
import type { Request, Response } from "express";
import User from "../models/User.js";
import Organisation from "../models/Organisation.js";
import Media from "../models/Media.js";
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
    const role = authReq.user?.role;

    if (!organisationId && role !== "super") {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    const whereClause = role === "super" ? undefined : { organisationId };

    const users = await User.findAll({
      where: whereClause,
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
    const role = authReq.user?.role;
    const { userId } = req.params as { userId: string };

    if (!organisationId && role !== "super") {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    const user = await User.findByPk(userId, { attributes: safeUserFields });

    if (!user || (role !== "super" && user.organisationId !== organisationId)) {
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
    const {
      email,
      password,
      firstName,
      lastName,
      userRole,
      organisationName: requestedOrganisationName,
    } = req.body;

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
    const roleToCreate =
      role === "super" && userRole === "admin" ? "admin" : "user";

    let createdOrganisationId = organisationId;

    if (role === "super" && requestedOrganisationName?.trim()) {
      const organisationName = requestedOrganisationName.trim();
      // create a tiny Media row so logo_id can be non-null (DB may enforce NOT NULL)
      const logoId = crypto.randomUUID();
      await Media.create({
        id: logoId,
        fileName: "auto",
        mimeType: "image/png",
        fileUrl: "",
      });

      const [organisation] = await Organisation.findOrCreate({
        where: { name: organisationName },
        defaults: {
          id: crypto.randomUUID(),
          name: organisationName,
          logoId,
        },
      });
      createdOrganisationId = organisation.id;
    }

    const newUser = await User.create({
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      organisationId: createdOrganisationId,
      role: roleToCreate,
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

    if (!currentUserId) {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    // allow super to operate across organisations
    if (role !== "super" && !organisationId) {
      return res.status(401).json({ msg: "Nicht autorisiert." });
    }

    const user = await User.findByPk(userId);

    if (!user || (role !== "super" && user.organisationId !== organisationId)) {
      return res.status(403).json({ msg: "Zugriff verweigert." });
    }

    const isSelf = currentUserId === userId;

    if (!isSelf && role !== "admin" && role !== "super") {
      return res.status(403).json({ msg: "Admin-Rechte erforderlich." });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      userRole,
      organisationName: requestedOrganisationName,
    } = req.body;

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

    if (requestedOrganisationName && (role === "admin" || role === "super")) {
      if (isSelf || role === "super") {
        const organisationName = requestedOrganisationName.trim();
        const logoId = crypto.randomUUID();
        await Media.create({
          id: logoId,
          fileName: "auto",
          mimeType: "image/png",
          fileUrl: "",
        });

        const [organisation] = await Organisation.findOrCreate({
          where: { name: organisationName },
          defaults: {
            id: crypto.randomUUID(),
            name: organisationName,
            logoId,
          },
        });
        user.organisationId = organisation.id;
      }
    }

    if (userRole) {
      if (isSelf) {
        return res
          .status(403)
          .json({ msg: "Sie können Ihre eigene Rolle nicht ändern." });
      }

      if (role === "super") {
        user.role = userRole === "admin" ? "admin" : "user";
      } else if (role === "admin" && userRole === "user") {
        user.role = "user";
      }
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

    if (!user || (role !== "super" && user.organisationId !== organisationId)) {
      return res.status(403).json({ msg: "Zugriff verweigert." });
    }

    await user.destroy();

    return res.status(200).json({ msg: "Benutzer:in gelöscht." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server-Fehler." });
  }
};
