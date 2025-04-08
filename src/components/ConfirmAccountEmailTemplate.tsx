import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  token: string;
}

export const EmailTemplate = ({ name, token }: EmailTemplateProps) => (
  <div>
    <h1>Olá, {name}!</h1>

    <p>Clique no link abaixo para confirmar sua conta:</p>

    <a href={`${process.env.FRONT_END}/confirm-account?token=${token}`}>
      Confirmar conta
    </a>
  </div>
);
