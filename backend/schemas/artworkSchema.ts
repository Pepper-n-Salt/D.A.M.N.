import { z } from "zod";

export const artworkIdSchema = z.object({
  artworkId: z.uuid(),
});

export const artworkLanguageSchema = z.object({
  languageCode: z.string().min(2).max(7),
});

export const artworkIdLanguageParamsSchema = z.object({
  artworkId: z.uuid(),
  languageCode: z.string().min(2).max(7),
});

export const createArtworkSchema = z.object({
  year: z.number().int().min(1),
  country: z.string().max(100).nullable(),
  dimensions: z.string().max(255).nullable(),
  imageId: z.uuid(),
  languageCode: z.string().min(2).max(7),
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).nullable(),
  origin: z.string().max(255).nullable(),
  material: z.string().max(255).nullable(),
  description: z.string().nullable(),
});

export const updateArtworkSchema = z.object({
  year: z.number().int().min(1).optional(),
  country: z.string().max(100).nullable().optional(),
  dimensions: z.string().max(255).nullable().optional(),
  imageId: z.uuid().optional(),
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(255).nullable().optional(),
  origin: z.string().max(255).nullable().optional(),
  material: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
});
