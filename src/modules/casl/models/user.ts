import { z } from 'zod';

import { roleSchema } from '../../../schemas/role';

const organizationRoleSchema = z.object({
  id: z.string(),
  role: z.enum(['MEMBER', 'ADMIN', 'MANAGER', 'BILLING', 'DEV']), // Adicione mais opções se existirem
});

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable(),
  iat: z.number(),
  exp: z.number(),
  organizationRole: organizationRoleSchema,
});

export type User = z.infer<typeof userSchema>;
