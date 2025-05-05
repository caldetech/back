import { z } from 'zod';

export const commissionSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('create'),
  ]),
  z.literal('Commission'),
]);

export type CommissionSubject = z.infer<typeof commissionSubject>;
