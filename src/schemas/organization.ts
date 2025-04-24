import { z } from 'zod';

export const OrganizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  domain: z.string().nullish(),
  shouldAttachUsersByDomain: z.boolean(),
  avatarUrl: z.string().url().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['ACTIVE', 'PENDING', 'INACTIVE']),
  ownerId: z.string(),
});

export type OrganizationDto = z.infer<typeof OrganizationSchema>;
