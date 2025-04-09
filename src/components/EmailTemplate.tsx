import * as React from 'react';
import { EmailTypes } from 'src/enums';

interface EmailTemplateProps {
  type: EmailTypes;
  name: string;
  token: string;
}

export const EmailTemplate = ({ type, name, token }: EmailTemplateProps) => (
  <>
    {type === EmailTypes.CONFIRM_ACCOUNT && (
      <div>
        <p>Olá {name},</p>
        <p>Você foi convidado(a) para ingressar na equipe:</p>
        <a href={`${process.env.FRONT_END}/confirmar-conta?token=${token}`}>
          Clique aqui para se cadastrar
        </a>
      </div>
    )}

    {type === EmailTypes.PASSWORD_RECOVER && (
      <div>
        <p>Olá {name},</p>
        <p>Você solicitou a recuperação da sua senha.</p>
        <p>Clique no link abaixo para redefinir:</p>
        <a href={`${process.env.FRONT_END}/nova-senha?token=${token}`}>
          Redefinir senha
        </a>
      </div>
    )}
  </>
);
