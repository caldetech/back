import React from 'react';
import { isValidElement } from 'react';
import { z } from 'zod';

export const emailSchema = z.object({
  from: z.string().email(),
  to: z.string().email(),
  subject: z.string(),
  react: z.custom<React.ReactElement>((val) => isValidElement(val)),
});

export type Email = z.infer<typeof emailSchema>;
