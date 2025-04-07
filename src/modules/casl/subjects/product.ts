import { z } from 'zod'

export const productSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('create'),
    z.literal('delete'),
  ]),
  z.literal('Product'),
])

export type ProductSubject = z.infer<typeof productSubject>

