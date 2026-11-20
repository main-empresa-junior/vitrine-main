'use client';

import { useEffect } from 'react';

// Vindo de outra página, o Next rola até a âncora ainda na tela de carregamento, antes de a seção existir.
export function ScrollToHashOnArrival() {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);
  return null;
}
