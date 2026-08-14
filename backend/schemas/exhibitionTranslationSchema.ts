import { z } from "zod";

// Body für das Anlegen einer neuen Translation
export const createExhibitionTranslationSchema = z.object({
  languageCode: z.string().min(2).max(7),
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).nullable(),
  location: z.string().max(255).nullable(),
  description: z.string().nullable(),
});

// Body für das Aktualisieren einer Translation
export const updateExhibitionTranslationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(255).nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
});
/*
  NEU:

  Dieser Body wird beim Klick auf "Translate" verwendet.

  Das Frontend muss lediglich sagen:

  {
    "targetLanguage": "en"
  }

  Das Backend holt sich die Ausgangsdaten selbst aus der DB.
*/

export const previewExhibitionTranslationSchema = z.object({
  targetLanguage: z.enum(["de", "en"]),
});
