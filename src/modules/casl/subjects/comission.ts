import { z } from 'zod'

export const comissionSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('update'),
  ]),
  z.literal('Comission'),
])

export type ComissionSubject = z.infer<typeof comissionSubject>

