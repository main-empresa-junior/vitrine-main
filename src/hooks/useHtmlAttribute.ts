'use client';

import { useSyncExternalStore } from 'react';

function subscribe(attribute: string, onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [attribute] });
  return () => observer.disconnect();
}

export function useHtmlAttribute(attribute: string, serverValue: string | null): string | null {
  return useSyncExternalStore(
    (onChange) => subscribe(attribute, onChange),
    () => document.documentElement.getAttribute(attribute),
    () => serverValue,
  );
}
