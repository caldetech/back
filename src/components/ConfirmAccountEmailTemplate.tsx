import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  token: string;
}

export const EmailTemplate = ({ name, token }: EmailTemplateProps) => (
  <div>
    <p>Você foi convidado(a) para ingressar na equipe:</p>

    <a href={`${process.env.FRONT_END}/confirmar-conta?token=${token}`}>
      Clique aqui para se cadastrar
    </a>
  </div>
);
