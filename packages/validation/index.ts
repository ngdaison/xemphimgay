import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(8),
  displayName: z.string().min(1).optional(),
});

export const contentCreateSchema = z.object({
  type: z.enum(['MOVIE', 'ANIME', 'VIDEO', 'STORY', 'MANGA']),
  title: z.string().min(1),
  originalTitle: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().min(1),
  releaseYear: z.number().optional(),
});
