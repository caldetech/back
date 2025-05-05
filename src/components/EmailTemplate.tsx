import * as React from 'react';
import { EmailTypes } from 'src/enums';

interface EmailTemplateProps {
  type: EmailTypes;
  name?: string;
  role?: string;
  slug?: string;
  tokenId?: string;
  inviteId?: string;
}

export const EmailTemplate = ({
  type,
  name,
  slug,
  role,
  tokenId,
  inviteId,
}: EmailTemplateProps) => (
  <>
    {type === EmailTypes.INVITE_USER && (
      <div>
        <p>Olá, você foi convidado(a) para ingressar na equipe Caldetech:</p>
        <a href={`${process.env.FRONT_END}/cadastrar?inviteId=${inviteId}`}>
          Clique aqui para se cadastrar
        </a>
      </div>
    )}

    {type === EmailTypes.CONFIRM_ACCOUNT && (
      <div>
        <p>Olá {name}, confirme sua conta para acessar a plataforma:</p>
        <a href={`${process.env.FRONT_END}/confirmar-conta?tokenId=${tokenId}`}>
          Clique aqui para confirmar sua conta
        </a>
      </div>
    )}

    {type === EmailTypes.PASSWORD_RECOVER && (
      <div>
        <p>Olá {name},</p>
        <p>Você solicitou a recuperação da sua senha.</p>
        <p>Clique no link abaixo para redefinir:</p>
        <a href={`${process.env.FRONT_END}/nova-senha?token=${tokenId}`}>
          Clique aqui para redefinir sua senha
        </a>
      </div>
    )}
  </>
);
