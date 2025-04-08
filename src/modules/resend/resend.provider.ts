import { Resend } from 'resend';

export const ResendProvider = {
  provide: Resend,
  useFactory: () => {
    return new Resend(process.env.RESEND_API_KEY);
  },
};
