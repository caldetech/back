import { z } from 'zod'

export const paymentSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('create'),
    z.literal('delete'),
  ]),
  z.literal('Payment'),
])

export type PaymentSubject = z.infer<typeof paymentSubject>

