import { z } from "zod";

export const registerSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Das Passwort muss mindestens 8 Zeichen lang sein.")
    .max(100, "Das Passwort darf maximal 100 Zeichen lang sein."),

  firstName: z
    .string()
    .trim()
    .min(1, "Der Vorname darf nicht leer sein.")
    .max(100),

  lastName: z
    .string()
    .trim()
    .min(1, "Der Nachname darf nicht leer sein.")
    .max(100),

  organisationId: z.uuid(),
});

export const loginSchema = z.object({
  email: z.email().transform((email) => email.toLowerCase()),

  password: z.string().min(1, "Das Passwort darf nicht leer sein."),
});
