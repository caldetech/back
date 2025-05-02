import { z } from 'zod';

export const blingSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('create'),
  ]),
  z.literal('Bling'),
]);

export type BlingSubject = z.infer<typeof blingSubject>;
