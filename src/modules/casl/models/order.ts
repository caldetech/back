import { z } from 'zod'

export const orderSchema = z.object({
  __typename: z.literal('Order').default('Order'),
  id: z.string(),
  ownerId: z.string(),
  isHidden: z.boolean().default(false)
})

export type Order = z.infer<typeof orderSchema>
