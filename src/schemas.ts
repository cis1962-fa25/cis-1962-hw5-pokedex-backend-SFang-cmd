import { z } from 'zod';

// zod validation for user inputs, specifically for box entries
export const InsertBoxEntrySchema = z.object({
  createdAt: z.iso.datetime(),
  level: z.number().int().min(1).max(100),
  location: z.string().min(1),
  notes: z.string().optional(),
  pokemonId: z.number().int().positive()
});

export const UpdateBoxEntrySchema = z.object({
  createdAt: z.iso.datetime().optional(),
  level: z.number().int().min(1).max(100).optional(),
  location: z.string().min(1).optional(),
  notes: z.string().optional(),
  pokemonId: z.number().int().positive().optional()
});