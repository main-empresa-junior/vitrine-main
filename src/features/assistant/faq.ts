// Textos do chat com o Orbi. A equipe edita aqui, sem mexer nos componentes.
import { REQUEST_PROJECT_PATH } from '@/lib/site';

export type FaqAction = {
  label: string;
  href: string;
  // Aviso mostrado pelo Orbi antes de levar a pessoa para o destino.
  notice: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: readonly string[];
  actions?: readonly FaqAction[];
};

export const WELCOME_MESSAGE =
  'Oi! Eu sou o Orbi, a assistente virtual da Main. Escolha uma pergunta que eu te respondo.';

export const CONTACT_ID = 'contact';
export const CONTACT_QUESTION = 'Entrar em contato';
export const CONTACT_ANSWER = 'Claro! Você pode falar com a gente pelo e-mail abaixo.';
export const CONTACT_EMAIL_LABEL = 'Escrever e-mail';
export const CONTACT_EMAIL_NOTICE = 'Abrindo seu e-mail…';
export const CONTACT_EMAIL_SUBJECT = 'Contato pelo site da Main';
export const CONTACT_EMAIL_BODY = 'Olá, Main! Vim pelo site e gostaria de conversar sobre';

export const FAQ: readonly FaqItem[] = [
  {
    id: 'request',
    question: 'Quero um projeto',
    answer: [
      'Que ótimo! Conte o que você precisa no formulário de pedido e a gente entra em contato.',
    ],
    actions: [
      {
        label: 'Solicitar projeto',
        href: REQUEST_PROJECT_PATH,
        notice: 'Redirecionando para Solicitar projeto…',
      },
    ],
  },
  {
    id: 'about',
    question: 'O que é a Main?',
    answer: ['[O que é a Main, cursos e universidade]'],
    actions: [
      { label: 'Conhecer a Main', href: '/#sobre', notice: 'Redirecionando para Sobre a Main…' },
    ],
  },
  {
    id: 'projects',
    question: 'Que tipo de projeto vocês fazem?',
    answer: ['[Tipos de projeto: sites, sistemas, apps]'],
    actions: [
      {
        label: 'Ver todos os projetos',
        href: '/#todos',
        notice: 'Redirecionando para Todos os projetos…',
      },
    ],
  },
  {
    id: 'process',
    question: 'Como funciona um projeto com a Main?',
    answer: ['[Etapas do processo, da conversa inicial à entrega]'],
  },
  {
    id: 'price',
    question: 'Quanto custa um projeto?',
    answer: ['[Como o valor é definido]'],
  },
  {
    id: 'deadline',
    question: 'Quanto tempo leva para ficar pronto?',
    answer: ['[Prazos médios]'],
  },
  {
    id: 'join',
    question: 'Como faço para fazer parte da Main?',
    answer: ['[Processo seletivo]'],
  },
];
