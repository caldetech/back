import React from 'react';
import { isValidElement } from 'react';
import { z } from 'zod';

export const emailSchema = z.object({
  type: z.enum(['PASSWORD_RECOVER', 'CONFIRM_ACCOUNT', 'INVITE_USER']),
  from: z.string().email(),
  to: z.string().email(),
  subject: z.string(),
  react: z.custom<React.ReactElement>((val) => isValidElement(val)),
});

export type Email = z.infer<typeof emailSchema>;
