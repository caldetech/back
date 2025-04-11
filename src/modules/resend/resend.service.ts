import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import { Email } from 'src/schemas/email';

@Injectable()
export class ResendService {
  constructor(private readonly resend: Resend) {}

  async sendEmail({ from, to, subject, react }: Email) {
    try {
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject,
        react,
      });

      if (error) {
        return Response.json({ error }, { status: 500 });
      }

      return Response.json(data);
    } catch (error) {
      return Response.json({ error }, { status: 500 });
    }
  }
}
