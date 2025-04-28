import { z } from 'zod';

export const commissionsubject = z.tuple([
  z.union([z.literal('manage'), z.literal('update')]),
  z.literal('Commission'),
]);

export type Commissionsubject = z.infer<typeof commissionsubject>;
