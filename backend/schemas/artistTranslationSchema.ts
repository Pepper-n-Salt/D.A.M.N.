import { z } from "zod";

/*
 * --------------------------------------------------------------------------
 * Neue Artist Translation
 * --------------------------------------------------------------------------
 */

export const createArtistTranslationSchema = z.object({
  languageCode: z.enum(["de", "en"]),

  firstName: z.string().min(1).max(255),

  lastName: z.string().min(1).max(255),

  description: z.string().nullable(),

  country: z.string().min(1).max(100).nullable(),
});

/*
 * --------------------------------------------------------------------------
 * Artist Translation aktualisieren
 * --------------------------------------------------------------------------
 */

export const updateArtistTranslationSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),

  lastName: z.string().min(1).max(255).optional(),

  description: z.string().nullable().optional(),

  country: z.string().min(1).max(100).nullable().optional(),
});

/*
 * --------------------------------------------------------------------------
 * Translation Preview
 * --------------------------------------------------------------------------
 */

export const previewArtistTranslationSchema = z.object({
  targetLanguage: z.enum(["de", "en"]),
});
