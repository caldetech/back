import { z } from 'zod'

export const dashboardSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('update'),
  ]),
  z.literal('Dashboard'),
])

export type DashboardSubject = z.infer<typeof dashboardSubject>

