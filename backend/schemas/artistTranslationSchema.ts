import { z } from "zod";

// Body für das Anlegen einer neuen ArtistTranslation
export const createArtistTranslationSchema = z.object({
  languageCode: z.string().min(2).max(7),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  description: z.string().nullable(),
  country: z.string().min(1).max(255),
});

// Body für das Aktualisieren einer ArtistTranslation
export const updateArtistTranslationSchema = z.object({
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  country: z.string().min(1).max(255).optional(),
});
