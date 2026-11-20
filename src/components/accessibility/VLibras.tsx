'use client';

import { useEffect } from 'react';
import Script from 'next/script';

import './vlibras.css';

const VLIBRAS_ROOT = 'https://vlibras.gov.br/app';
const VLIBRAS_SCRIPT = `${VLIBRAS_ROOT}/vlibras-plugin.js`;
// Elementos que o próprio widget cria no <body>, fora da árvore do React.
const VLIBRAS_ELEMENT_IDS = ['vlibras-access-wrapper', 'vlibras-app-root'] as const;

type VLibrasWindow = Window & {
  VLibras?: { Widget: new (options: { rootPath: string; position: 'L' | 'R' }) => unknown };
  vlibrasStarted?: boolean;
};

function setWidgetHidden(isHidden: boolean) {
  for (const id of VLIBRAS_ELEMENT_IDS) {
    const element = document.getElementById(id);
    if (element) element.hidden = isHidden;
  }
}

// O carregador do VLibras se inicializa sozinho 50 ms depois de carregar; chamando o construtor
// no onLoad, a posição à esquerda vale antes disso. A verificação evita uma segunda chamada.
function startWidget() {
  const vlibrasWindow = window as VLibrasWindow;
  if (vlibrasWindow.vlibrasStarted || !vlibrasWindow.VLibras) return;
  vlibrasWindow.vlibrasStarted = true;
  new vlibrasWindow.VLibras.Widget({ rootPath: VLIBRAS_ROOT, position: 'L' });
}

function reportLoadError() {
  if (process.env.NODE_ENV === 'development') {
    console.warn('VLibras indisponível: o site segue funcionando sem o tradutor de Libras.');
  }
}

// O widget fica no <body> ao trocar de página; ao sair da área pública (painel) ele é escondido.
export function VLibras() {
  useEffect(() => {
    setWidgetHidden(false);
    return () => setWidgetHidden(true);
  }, []);

  return (
    <Script
      id="vlibras"
      src={VLIBRAS_SCRIPT}
      strategy="lazyOnload"
      onReady={startWidget}
      onError={reportLoadError}
    />
  );
}
