import { z } from "zod";

export const userIdSchema = z.object({
  userId: z.uuid(),
});

export const createUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  userRole: z.enum(["user", "admin"]).optional(),
  organisationName: z.string().min(1).max(255).optional(),
});

export const updateUserSchema = z.object({
  email: z.email().optional(),
  password: z.string().min(8).optional(),
  firstName: z.string().min(1).max(255).optional(),
  lastName: z.string().min(1).max(255).optional(),
  userRole: z.enum(["user", "admin"]).optional(),
  organisationName: z.string().min(1).max(255).optional(),
});
