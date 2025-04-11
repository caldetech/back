import { z } from 'zod';

export const blingTokensSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  token_type: z.string(),
  scope: z.string(),
  refresh_token: z.string(),
});

export type BlingTokensSchema = z.infer<typeof blingTokensSchema>;
