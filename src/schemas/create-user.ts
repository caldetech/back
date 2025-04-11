import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
  tokenId: z.string().optional(),
  inviteId: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
