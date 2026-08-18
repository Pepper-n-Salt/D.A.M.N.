import { z } from "zod";

// Body für das Anlegen einer neuen ArtworkTranslation
export const createArtworkTranslationSchema = z.object({
  languageCode: z.enum(["de", "en"]),
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).nullable(),
  country: z.string().max(255).nullable(),
  origin: z.string().max(255).nullable(),
  material: z.string().max(255).nullable(),
  description: z.string().nullable(),
});

// Body für das Aktualisieren einer ArtworkTranslation
export const updateArtworkTranslationSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(255).nullable().optional(),
  country: z.string().max(255).nullable().optional(),
  origin: z.string().max(255).nullable().optional(),
  material: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
});

export const previewArtworkTranslationSchema = z.object({
  targetLanguage: z.enum(["de", "en"]),
});
