import { z } from "zod";

export const artistIdSchema = z.object({
  artistId: z.uuid(),
});

export const artistLanguageSchema = z.object({
  languageCode: z.enum(["de", "en"]),
});

export const artistIdLanguageParamsSchema = z.object({
  artistId: z.uuid(),
  languageCode: z.enum(["de", "en"]),
});

export const createArtistSchema = z.object({
  languageCode: z.enum(["de", "en"]),

  firstName: z.string().min(1).max(255),

  lastName: z.string().min(1).max(255),

  dateOfBirth: z.iso.date().nullable(),

  dateOfDeath: z.iso.date().nullable(),

  country: z.string().min(1).max(100),

  description: z.string().nullable(),

  imageId: z.uuid().nullable(),
});

export const updateArtistSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),

  lastName: z.string().min(1).max(255).optional(),

  dateOfBirth: z.iso.date().nullable().optional(),

  dateOfDeath: z.iso.date().nullable().optional(),

  country: z.string().min(1).max(100).optional(),

  description: z.string().nullable().optional(),

  imageId: z.uuid().nullable().optional(),
});
