import { z } from 'zod';

export const orderSchema = z.object({
  id: z.string(),
  status: z.string(),
  type: z.string(),
  customer: z.string(),
  payment: z.string(),
});

export const orderResponseSchema = z.array(orderSchema);

export type OrderResponse = z.infer<typeof orderResponseSchema>;

export type Order = z.infer<typeof orderSchema>;
