import { z } from "zod";

export const artworkIdSchema = z.object({
  artworkId: z.uuid(),
});

export const createArtworkSchema = z.object({
  year: z.number(),
  country: z.string().max(100).nullable(),
  dimensions: z.string().max(255).nullable(),
  imageId: z.uuid(),
  languageCode: z.string().min(2).max(7),
  title: z.string().max(255),
  subtitle: z.string().max(255).nullable(),
  origin: z.string().max(255).nullable(),
  material: z.string().max(255).nullable(),
  description: z.string().nullable(),
});

export const updateArtworkSchema = z.object({
  year: z.number().optional(),
  country: z.string().max(100).nullable().optional(),
  dimensions: z.string().max(255).nullable().optional(),
  imageId: z.uuid().optional(),
  languageCode: z.string().min(2).max(7), // hier nochmal nachschauen
  title: z.string().max(255).optional(),
  subtitle: z.string().max(255).nullable().optional(),
  origin: z.string().max(255).nullable().optional(),
  material: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
});

// export const updateExhibitionSchema = z.object({
//   coverImageId: z.uuid().nullable().optional(),
//   startDate: z.iso.date().optional(),
//   endDate: z.iso.date().optional(),
//   languageCode: z.string().min(2).max(7),
//   title: z.string().min(1).max(255).optional(),
//   subtitle: z.string().max(255).nullable().optional(),
//   location: z.string().max(255).nullable().optional(),
//   description: z.string().nullable().optional(),
// });
