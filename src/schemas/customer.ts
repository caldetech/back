import { z } from 'zod';

export const customerSchema = z.object({
  customerType: z.enum(['COMPANY', 'PERSON']),
  name: z.string(),
  document: z.string(),
  address: z.string(),
  mainNumber: z.string(),
  contactNumber: z.string(),
});

export type Customer = z.infer<typeof customerSchema>;
