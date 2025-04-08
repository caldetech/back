import { z } from 'zod';

export const tokenSchema = z.union([
  z.literal('PASSWORD_RECOVER'),
  z.literal('CONFIRM_ACCOUNT'),
  z.literal('INVITE_USER'),
]);

export type Token = z.infer<typeof tokenSchema>;
