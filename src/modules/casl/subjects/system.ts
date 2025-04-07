import { z } from 'zod'

export const systemSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('update'),
  ]),
  z.literal('System'),
])

export type SystemSubject = z.infer<typeof systemSubject>

