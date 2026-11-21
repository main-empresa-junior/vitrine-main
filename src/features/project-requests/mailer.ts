import 'server-only';

export type MailMessage = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

export type SendMail = (message: MailMessage) => Promise<void>;

// shortcut: só registra a mensagem no servidor até a escolha do serviço de e-mail; trocar aqui
// por um transporte de verdade não muda o formulário nem a Server Action.
const logMail: SendMail = async (message) => {
  console.info(`[e-mail não enviado: sem serviço configurado] ${message.subject} → ${message.to}`);
};

export const sendMail: SendMail = logMail;
