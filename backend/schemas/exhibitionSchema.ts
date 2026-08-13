import { z } from "zod";

export const exhibitionIdSchema = z.object({
  exhibitionId: z.uuid(),
});

export const exhibitionLanguageSchema = z.object({
  languageCode: z.string().min(2).max(7),
});

export const exhibitionIdLanguageParamsSchema = z.object({
  exhibitionId: z.uuid(),
  languageCode: z.string().min(2).max(7),
});

export const createExhibitionSchema = z.object({
  coverImageId: z.uuid().nullable(),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  languageCode: z.string().min(2).max(7),
  title: z.string().min(1).max(255),
  subtitle: z.string().max(255).nullable(),
  location: z.string().max(255).nullable(),
  description: z.string().nullable(),
});

export const updateExhibitionSchema = z.object({
  coverImageId: z.uuid().nullable().optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
  title: z.string().min(1).max(255).optional(),
  subtitle: z.string().max(255).nullable().optional(),
  location: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
});
