import { z } from 'zod';

import { roleSchema } from '../../../schemas/roles';

export const userSchema = z.object({
  id: z.string(),
  role: roleSchema,
});

export type User = z.infer<typeof userSchema>;
