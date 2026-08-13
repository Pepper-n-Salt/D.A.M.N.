import { z } from "zod";

// Params für: POST /:exhibitionId/translations
export const exhibitionIdSchema = z.object({
  exhibitionId: z.uuid(),
});

// Params für: PATCH /:exhibitionId/translations/:languageCode
export const exhibitionIdLanguageCodeSchema = z.object({
  exhibitionId: z.uuid(),
  languageCode: z.string().min(2).max(7),
});

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
