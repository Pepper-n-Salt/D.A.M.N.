import bcrypt from "bcrypt";
import crypto from "node:crypto";

import type { Request, Response } from "express";

import User from "../models/User.js";
import Organisation from "../models/Organisation.js";

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

/*
|--------------------------------------------------------------------------
| Alle User anzeigen
|--------------------------------------------------------------------------
*/

export const showAllUsers = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const organisationId = req.user.organisationId;
    const role = req.user.role;

    if (!organisationId && role !== "super") {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    /*
     * Superadmin:
     * sieht alle User aus allen Organisationen.
     *
     * Admin:
     * sieht nur User seiner Organisation.
     */
    const whereClause = role === "super" ? undefined : { organisationId };

    const users = await User.findAll({
      where: whereClause,
      attributes: safeUserFields,
    });

    return res.json({
      users,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Einzelnen User anzeigen
|--------------------------------------------------------------------------
*/

export const showUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const organisationId = req.user?.organisationId;
    const role = req.user?.role;
    const { userId } = req.params;

    if (!organisationId && role !== "super") {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const user = await User.findByPk(userId, {
      attributes: safeUserFields,
    });

    if (!user || (role !== "super" && user.organisationId !== organisationId)) {
      return res.status(403).json({
        msg: "Zugriff verweigert.",
      });
    }

    return res.json({
      user,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| User erstellen
|--------------------------------------------------------------------------
|
| SUPER:
|   - darf Admins und User erstellen
|   - gibt den Organisationsnamen an
|   - Organisation wird gesucht oder neu angelegt
|   - ID wird automatisch erzeugt
|
| ADMIN:
|   - darf nur User erstellen
|   - bekommt automatisch die eigene Organisation
|
*/

export const createUser = async (req: Request, res: Response) => {
  try {
    const currentOrganisationId = req.user?.organisationId;
    const currentRole = req.user?.role;

    const { email, password, firstName, lastName, userRole, organisationName } =
      req.body;

    /*
    |--------------------------------------------------------------------------
    | Berechtigung
    |--------------------------------------------------------------------------
    */

    if (currentRole !== "admin" && currentRole !== "super") {
      return res.status(403).json({
        msg: "Admin-Rechte erforderlich.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | E-Mail prüfen
    |--------------------------------------------------------------------------
    */

    const existingUser = await User.findOne({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "Diese E-Mail ist bereits vergeben.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Rolle bestimmen
    |--------------------------------------------------------------------------
    */

    let roleToCreate: "admin" | "user";

    if (currentRole === "super") {
      /*
       * Superadmin darf Admin oder User erstellen.
       */
      roleToCreate = userRole === "admin" ? "admin" : "user";
    } else {
      /*
       * Admin darf ausschließlich User erstellen.
       */
      roleToCreate = "user";
    }

    /*
    |--------------------------------------------------------------------------
    | Organisation bestimmen
    |--------------------------------------------------------------------------
    */

    let createdOrganisationId: string | undefined;

    if (currentRole === "super") {
      /*
       * Superadmin muss eine Organisation angeben.
       */
      if (!organisationName?.trim()) {
        return res.status(400).json({
          msg: "Eine Organisation muss angegeben werden.",
        });
      }

      const trimmedOrganisationName = organisationName.trim();

      /*
       * Existiert die Organisation bereits?
       *
       * JA:
       *   vorhandene Organisation + vorhandene ID verwenden.
       *
       * NEIN:
       *   neue Organisation mit neuer UUID anlegen.
       */
      const [organisation] = await Organisation.findOrCreate({
        where: {
          name: trimmedOrganisationName,
        },
        defaults: {
          id: crypto.randomUUID(),
          name: trimmedOrganisationName,
        },
      });

      createdOrganisationId = organisation.id;
    } else {
      /*
       * Admin:
       *
       * Die Organisation kommt ausschließlich
       * aus dem eingeloggten Admin.
       *
       * Ein Wert aus dem Frontend wird nicht benötigt
       * und kann die Organisation nicht verändern.
       */
      if (!currentOrganisationId) {
        return res.status(400).json({
          msg: "Dem Admin ist keine Organisation zugewiesen.",
        });
      }

      createdOrganisationId = currentOrganisationId;
    }

    /*
    |--------------------------------------------------------------------------
    | Passwort
    |--------------------------------------------------------------------------
    */

    const hashedPassword = await bcrypt.hash(password, 12);

    /*
    |--------------------------------------------------------------------------
    | User erstellen
    |--------------------------------------------------------------------------
    */

    const newUser = await User.create({
      id: crypto.randomUUID(),
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      organisationId: createdOrganisationId,
      role: roleToCreate,
    });

    return res.status(201).json({
      user: sanitizeUser(newUser),
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| User aktualisieren
|--------------------------------------------------------------------------
*/

export const updateUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const organisationId = req.user?.organisationId;
    const role = req.user?.role;
    const currentUserId = req.user?.id;
    const { userId } = req.params;

    if (!currentUserId) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    if (role !== "super" && !organisationId) {
      return res.status(401).json({
        msg: "Nicht autorisiert.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user || (role !== "super" && user.organisationId !== organisationId)) {
      return res.status(403).json({
        msg: "Zugriff verweigert.",
      });
    }

    const isSelf = currentUserId === userId;

    if (!isSelf && role !== "admin" && role !== "super") {
      return res.status(403).json({
        msg: "Admin-Rechte erforderlich.",
      });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      userRole,
      organisationName: requestedOrganisationName,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | E-Mail
    |--------------------------------------------------------------------------
    */

    if (email) {
      const normalizedEmail = email.toLowerCase();

      const existingUser = await User.findOne({
        where: {
          email: normalizedEmail,
        },
      });

      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({
          msg: "Diese E-Mail ist bereits vergeben.",
        });
      }

      user.email = normalizedEmail;
    }

    /*
    |--------------------------------------------------------------------------
    | Passwort
    |--------------------------------------------------------------------------
    */

    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    /*
    |--------------------------------------------------------------------------
    | Name
    |--------------------------------------------------------------------------
    */

    if (firstName !== undefined) {
      user.firstName = firstName;
    }

    if (lastName !== undefined) {
      user.lastName = lastName;
    }

    /*
    |--------------------------------------------------------------------------
    | Organisation
    |--------------------------------------------------------------------------
    |
    | Nur Superadmins dürfen eine Organisation ändern.
    |
    | Hier bleibt die bestehende Logik mit dem
    | Organisationsnamen erhalten.
    |
    */

    if (requestedOrganisationName !== undefined) {
      if (role !== "super") {
        return res.status(403).json({
          msg: "Nur Superadmins dürfen die Organisation ändern.",
        });
      }

      if (!requestedOrganisationName.trim()) {
        return res.status(400).json({
          msg: "Eine Organisation muss angegeben werden.",
        });
      }

      const trimmedOrganisationName = requestedOrganisationName.trim();

      const [organisation] = await Organisation.findOrCreate({
        where: {
          name: trimmedOrganisationName,
        },
        defaults: {
          id: crypto.randomUUID(),
          name: trimmedOrganisationName,
        },
      });

      user.organisationId = organisation.id;
    }

    /*
    |--------------------------------------------------------------------------
    | Rolle
    |--------------------------------------------------------------------------
    */

    if (userRole) {
      if (isSelf) {
        return res.status(403).json({
          msg: "Sie können Ihre eigene Rolle nicht ändern.",
        });
      }

      if (role === "super") {
        user.role = userRole === "admin" ? "admin" : "user";
      } else if (role === "admin") {
        /*
         * Admin darf nur User-Rollen vergeben.
         */
        if (userRole !== "user") {
          return res.status(403).json({
            msg: "Admins dürfen keine Admin-Rollen vergeben.",
          });
        }

        user.role = "user";
      }
    }

    await user.save();

    return res.json({
      user: sanitizeUser(user),
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| User löschen
|--------------------------------------------------------------------------
*/

export const deleteUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  try {
    const organisationId = req.user?.organisationId;
    const role = req.user?.role;
    const { userId } = req.params;

    if (role !== "admin" && role !== "super") {
      return res.status(403).json({
        msg: "Admin-Rechte erforderlich.",
      });
    }

    const user = await User.findByPk(userId);

    if (!user || (role !== "super" && user.organisationId !== organisationId)) {
      return res.status(403).json({
        msg: "Zugriff verweigert.",
      });
    }

    await user.destroy();

    return res.status(200).json({
      msg: "Benutzer:in gelöscht.",
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({
      msg: "Server-Fehler.",
    });
  }
};
