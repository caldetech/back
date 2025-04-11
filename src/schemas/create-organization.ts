import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string(),
  slug: z.string(),
  userId: z.string(),
});

export type CreateOrganizationDto = z.infer<typeof createOrganizationSchema>;
